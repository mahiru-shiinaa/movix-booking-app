import React from 'react';
import { Card, Tag, Typography, Rate, Button } from 'antd';
import { ClockCircleOutlined, CalendarOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createPath, ROUTES } from '../../routes';
import './style.css';

const { Meta } = Card;
const { Text, Title } = Typography;

const MovieCard = ({ movie, showActions = true }) => {
  const navigate = useNavigate();

  // Xử lý click vào card
  const handleCardClick = () => {
    navigate(createPath(ROUTES.MOVIE_DETAIL, { id: movie.id }));
  };

  // Xử lý click nút đặt vé
  const handleBookNow = (e) => {
    e.stopPropagation(); // Ngăn event bubbling
    navigate(createPath(ROUTES.MOVIE_DETAIL, { id: movie.id }));
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // SỬA LỖI: Tạo function xử lý ảnh poster đúng cách
  const getImageSrc = (posterUrl) => {
    // Nếu có posterUrl và là URL hợp lệ, sử dụng nó
    if (posterUrl && (posterUrl.startsWith('http') || posterUrl.startsWith('https'))) {
      return posterUrl;
    }
    // Nếu không có hoặc là đường dẫn local, tạo placeholder
    return `https://via.placeholder.com/300x450/1890ff/ffffff?text=${encodeURIComponent(movie.title)}`;
  };

  const actions = showActions ? [
    <Button 
      type="primary" 
      icon={<PlayCircleOutlined />}
      onClick={handleBookNow}
      size="small"
    >
      Đặt vé
    </Button>
  ] : [];

  return (
    <Card
      hoverable
      className="movie-card"
      cover={
        <div className="movie-card-cover">
          <img
            alt={movie.title}
            src={getImageSrc(movie.posterUrl)}
            style={{ 
              width: '100%', 
              height: 300, 
              objectFit: 'cover' 
            }}
            onError={(e) => {
              // SỬA LỖI: Fallback khi ảnh lỗi
              e.target.src = `https://via.placeholder.com/300x450/cccccc/666666?text=${encodeURIComponent(movie.title)}`;
            }}
          />
          {/* Status badge */}
          <div className="movie-status-badge">
            <Tag color={movie.status === 'now-showing' ? 'green' : 'blue'}>
              {movie.status === 'now-showing' ? 'Đang chiếu' : 'Sắp chiếu'}
            </Tag>
          </div>
          {/* Rating */}
          <div className="movie-rating">
            <Rate 
              disabled 
              defaultValue={Math.round(movie.rating / 2)} 
              style={{ fontSize: '12px', color: '#ffd700' }}
            />
            <Text style={{ color: 'white', marginLeft: '8px', fontSize: '12px' }}>
              {movie.rating}/10
            </Text>
          </div>
        </div>
      }
      actions={actions}
      onClick={handleCardClick}
    >
      <Meta
        title={
          <Title level={5} ellipsis={{ rows: 2 }} style={{ margin: 0, minHeight: '48px' }}>
            {movie.title}
          </Title>
        }
        description={
          <div className="movie-card-info">
            {/* Thể loại */}
            <div style={{ marginBottom: '8px' }}>
              {movie.genre.map((g, index) => (
                <Tag key={index} size="small" color="blue">
                  {g}
                </Tag>
              ))}
            </div>
            
            {/* Thời lượng */}
            <div style={{ marginBottom: '4px' }}>
              <ClockCircleOutlined style={{ marginRight: '4px', color: '#666' }} />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {movie.duration} phút
              </Text>
            </div>
            
            {/* Ngày khởi chiếu */}
            <div style={{ marginBottom: '8px' }}>
              <CalendarOutlined style={{ marginRight: '4px', color: '#666' }} />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {formatDate(movie.releaseDate)}
              </Text>
            </div>
            
            {/* Mô tả ngắn */}
            <Text 
              type="secondary" 
              ellipsis={{ rows: 2 }}
              style={{ fontSize: '12px', lineHeight: '1.4' }}
            >
              {movie.description}
            </Text>
          </div>
        }
      />
    </Card>
  );
};

export default MovieCard;