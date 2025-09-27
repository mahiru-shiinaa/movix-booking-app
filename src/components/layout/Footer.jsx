import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { 
  FacebookOutlined, 
  TwitterOutlined, 
  InstagramOutlined, 
  YoutubeOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

const Footer = () => {
  return (
    <AntFooter 
      style={{ 
        background: '#001529', 
        color: 'white',
        padding: '40px 5%'
      }}
    >
      <Row gutter={[32, 32]}>
        {/* Logo và mô tả */}
        <Col xs={24} md={8}>
          <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
            🎬 MOVIX
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
            Hệ thống đặt vé xem phim trực tuyến hiện đại với AI Chatbot thông minh. 
            Trải nghiệm điện ảnh tuyệt vời với công nghệ tốt nhất.
          </Text>
          <div style={{ marginTop: '20px' }}>
            <Space size="middle">
              <Link href="#" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '20px' }}>
                <FacebookOutlined />
              </Link>
              <Link href="#" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '20px' }}>
                <TwitterOutlined />
              </Link>
              <Link href="#" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '20px' }}>
                <InstagramOutlined />
              </Link>
              <Link href="#" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '20px' }}>
                <YoutubeOutlined />
              </Link>
            </Space>
          </div>
        </Col>

        {/* Liên kết nhanh */}
        <Col xs={24} md={8}>
          <Title level={4} style={{ color: 'white', marginBottom: '16px' }}>
            Liên kết nhanh
          </Title>
          <Space direction="vertical" size="small">
            <Link href="/" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Trang chủ
            </Link>
            <Link href="/movies" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Danh sách phim
            </Link>
            <Link href="#" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Về chúng tôi
            </Link>
            <Link href="#" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Điều khoản sử dụng
            </Link>
            <Link href="#" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Chính sách bảo mật
            </Link>
          </Space>
        </Col>

        {/* Liên hệ */}
        <Col xs={24} md={8}>
          <Title level={4} style={{ color: 'white', marginBottom: '16px' }}>
            Liên hệ
          </Title>
          <Space direction="vertical" size="small">
            <Space>
              <MailOutlined style={{ color: 'rgba(255,255,255,0.7)' }} />
              <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                support@movix.vn
              </Text>
            </Space>
            <Space>
              <PhoneOutlined style={{ color: 'rgba(255,255,255,0.7)' }} />
              <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                1900 1234
              </Text>
            </Space>
            <Text style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
              Địa chỉ: 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
            </Text>
          </Space>
        </Col>
      </Row>

      {/* Copyright */}
      <div 
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          marginTop: '40px',
          paddingTop: '20px',
          textAlign: 'center'
        }}
      >
        <Text style={{ color: 'rgba(255,255,255,0.5)' }}>
          © 2025 Movix. All rights reserved. Made with ❤️ for movie lovers.
        </Text>
      </div>
    </AntFooter>
  );
};

export default Footer;