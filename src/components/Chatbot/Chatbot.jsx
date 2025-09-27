import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from "react-markdown";
import { 
  Button, Card, Input, Avatar, Typography, Space, Spin,
  Tooltip, Badge
} from 'antd';
import { 
  MessageOutlined, SendOutlined, CloseOutlined, RobotOutlined,
  UserOutlined, ClearOutlined
} from '@ant-design/icons';
import { askGemini, initializeChatbotData  } from '../../services/geminiService';
import './style.css';

const { Text } = Typography;
const { TextArea } = Input;

const Chatbot = () => {
  // States
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Tin nhắn chào mừng
const welcomeMessage = useMemo(() => ({
  id: Date.now(),
  type: 'bot',
  content: `👋 Xin chào! Tôi là trợ lý AI của Movix. 

Tôi có thể giúp bạn:
🎬 Tìm kiếm phim theo thể loại, diễn viên
🔍 Gợi ý phim phù hợp với sở thích
⭐ So sánh và đánh giá phim
📅 Thông tin lịch chiếu

Bạn muốn tìm loại phim nào hôm nay?`,
  timestamp: new Date()
}), []);
  useEffect(() => {
    initializeChatbotData();
  }, []);
  // Khởi tạo với tin nhắn chào mừng
useEffect(() => {
  if (messages.length === 0) {
    setMessages([welcomeMessage]);
  }
}, [messages.length, welcomeMessage]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input khi mở chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  // Gửi tin nhắn
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Gọi Gemini API
      const response = await askGemini(inputValue.trim());
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Nếu chat đang đóng, hiển thị notification
      if (!isOpen) {
        setHasNewMessage(true);
      }

    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Xin lỗi, tôi gặp lỗi khi xử lý câu hỏi của bạn. Vui lòng thử lại sau! 😅',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý Enter để gửi tin nhắn
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Clear chat
  const clearChat = () => {
    setMessages([welcomeMessage]);
  };

  // Format thời gian
  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Quick suggestions
  const quickSuggestions = [
    'Gợi ý phim hành động hay',
    'Phim hoạt hình cho gia đình',
    'Phim đang chiếu hôm nay',
    'Phim có rating cao nhất'
  ];

  const handleQuickSuggestion = (suggestion) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="chatbot-container">
      {/* Chat Window */}
      {isOpen && (
        <Card 
          className="chat-window"
          title={
            <Space>
              <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
              <span>Trợ lý AI Movix</span>
              <Badge status="success" text="Đang hoạt động" />
            </Space>
          }
          extra={
            <Space>
              <Tooltip title="Xóa cuộc trò chuyện">
                <Button 
                  icon={<ClearOutlined />} 
                  type="text" 
                  size="small"
                  onClick={clearChat}
                />
              </Tooltip>
              <Button 
                icon={<CloseOutlined />} 
                type="text" 
                size="small"
                onClick={toggleChat}
              />
            </Space>
          }
          bodyStyle={{ padding: 0, height: '700px', display: 'flex', flexDirection: 'column' }}
        >
          {/* Messages Area */}
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-avatar">
                  <Avatar 
                    icon={message.type === 'user' ? <UserOutlined /> : <RobotOutlined />}
                    style={{ 
                      backgroundColor: message.type === 'user' ? '#52c41a' : '#1890ff' 
                    }}
                    size="small"
                  />
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    <Text style={{ whiteSpace: 'pre-wrap' }}>
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </Text>
                  </div>
                  <div className="message-time">
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      {formatTime(message.timestamp)}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="message bot-message">
                <div className="message-avatar">
                  <Avatar 
                    icon={<RobotOutlined />}
                    style={{ backgroundColor: '#1890ff' }}
                    size="small"
                  />
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    <Space>
                      <Spin size="small" />
                      <Text>Đang suy nghĩ...</Text>
                    </Space>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 1 && !isLoading && (
            <div className="quick-suggestions">
              <Text type="secondary" style={{ fontSize: '12px', marginBottom: '8px', display: 'block' }}>
                Gợi ý câu hỏi:
              </Text>
              <Space wrap>
                {quickSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    size="small"
                    type="dashed"
                    onClick={() => handleQuickSuggestion(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </Space>
            </div>
          )}

          {/* Input Area */}
          <div className="chat-input-container">
            <Space.Compact style={{ width: '100%' }}>
              <TextArea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi về phim..."
                autoSize={{ minRows: 1, maxRows: 3 }}
                disabled={isLoading}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                loading={isLoading}
              >
                Gửi
              </Button>
            </Space.Compact>
          </div>
        </Card>
      )}

      {/* Chat Toggle Button */}
      <Tooltip title={isOpen ? "Đóng chat" : "Chat với AI"} placement="left">
        <Badge dot={hasNewMessage && !isOpen} offset={[-5, 5]}>
          <Button
            className="chat-toggle-btn"
            type="primary"
            shape="circle"
            size="large"
            icon={isOpen ? <CloseOutlined /> : <MessageOutlined />}
            onClick={toggleChat}
          />
        </Badge>
      </Tooltip>
    </div>
  );
};

export default Chatbot;