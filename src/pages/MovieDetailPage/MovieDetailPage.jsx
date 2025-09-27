import React from 'react';
import { 
  Layout, Row, Col, Typography, Tag, Rate, Button, Spin, Alert, 
  Card, Divider, Space, Modal 
} from 'antd';
import { 
  PlayCircleOutlined, ClockCircleOutlined, CalendarOutlined, 
  UserOutlined, VideoCameraOutlined, StarOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovieDetail } from '../../hooks/useMovies';
import { createPath, ROUTES } from '../../routes';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movie, showtimes, loading, error } = useMovieDetail(id);

  // Xử lý đặt vé
  const handleBookTicket = (showtimeId) => {
    navigate(createPath(ROUTES.BOOKING, { showtimeId }));
  };

  // Xử lý xem trailer (giả lập)
  const handleWatchTrailer = () => {
    Modal.info({
      title: 'Trailer',
      content: 'Chức năng xem trailer sẽ được triển khai trong phiên bản tiếp theo.',
      okText: 'Đóng'
    });
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Nhóm showtimes theo rạp
  const groupShowtimesByCinema = (showtimes) => {
    return showtimes.reduce((acc, showtime) => {
      const cinema = showtime.cinema;
      if (!acc[cinema]) {
        acc[cinema] = [];
      }
      acc[cinema].push(showtime);
      return acc;
    }, {});
  };

  if (loading) {
    return (
      <Layout>
        <Content style={{ padding: '50px 5%' }}>
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <Spin size="large" />
            <p style={{ marginTop: '20px', color: '#666' }}>Đang tải thông tin phim...</p>
          </div>
        </Content>
      </Layout>
    );
  }

  if (error || !movie) {
    return (
      <Layout>
        <Content style={{ padding: '50px 5%' }}>
          <Alert
            message="Không tìm thấy phim"
            description="Phim bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
            type="error"
            showIcon
            action={
              <Button type="primary" onClick={() => navigate(ROUTES.MOVIES)}>
                Quay lại danh sách phim
              </Button>
            }
          />
        </Content>
      </Layout>
    );
  }

  const groupedShowtimes = groupShowtimesByCinema(showtimes);

  return (
    <Layout>
      <Content>
        {/* Hero Section */}
        <div
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${movie.posterUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            color: 'white',
            padding: '0 5%'
          }}
        >
          <Row gutter={[32, 32]} align="middle" style={{ width: '100%' }}>
            <Col xs={24} md={8}>
              <img
                src={movie.posterUrl}
                alt={movie.title}
                style={{
                  width: '100%',
                  maxWidth: '350px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                }}
              />
            </Col>
            <Col xs={24} md={16}>
              <div>
                <Title level={1} style={{ color: 'white', marginBottom: '16px' }}>
                  {movie.title}
                </Title>
                
                <div style={{ marginBottom: '20px' }}>
                  {movie.genre.map((g, index) => (
                    <Tag key={index} color="blue" style={{ marginBottom: '8px' }}>
                      {g}
                    </Tag>
                  ))}
                  <Tag color={movie.status === 'now-showing' ? 'green' : 'orange'}>
                    {movie.status === 'now-showing' ? 'Đang chiếu' : 'Sắp chiếu'}
                  </Tag>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <Rate 
                    disabled 
                    value={Math.round(movie.rating / 2)} 
                    style={{ color: '#ffd700' }}
                  />
                  <span style={{ marginLeft: '10px', fontSize: '16px' }}>
                    {movie.rating}/10
                  </span>
                </div>

                <Space size="large" style={{ marginBottom: '20px', flexWrap: 'wrap' }}>
                  <Space>
                    <ClockCircleOutlined />
                    <Text style={{ color: 'white' }}>{movie.duration} phút</Text>
                  </Space>
                  <Space>
                    <CalendarOutlined />
                    <Text style={{ color: 'white' }}>{formatDate(movie.releaseDate)}</Text>
                  </Space>
                  <Space>
                    <UserOutlined />
                    <Text style={{ color: 'white' }}>Đạo diễn: {movie.director}</Text>
                  </Space>
                </Space>

                <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginBottom: '24px' }}>
                  {movie.description}
                </Paragraph>

                <Space size="middle">
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlayCircleOutlined />}
                    onClick={handleWatchTrailer}
                  >
                    Xem Trailer
                  </Button>
                  {movie.status === 'now-showing' && showtimes.length > 0 && (
                    <Button
                      type="primary"
                      size="large"
                      style={{ background: '#52c41a', borderColor: '#52c41a' }}
                      onClick={() => {
                        const firstShowtime = showtimes[0];
                        handleBookTicket(firstShowtime.id);
                      }}
                    >
                      Đặt vé ngay
                    </Button>
                  )}
                </Space>
              </div>
            </Col>
          </Row>
        </div>

        {/* Movie Info Section */}
        <div style={{ padding: '50px 5%', background: '#fafafa' }}>
          <Row gutter={[32, 32]}>
            {/* Chi tiết phim */}
            <Col xs={24} lg={16}>
              <Card title="Thông tin chi tiết" style={{ marginBottom: '24px' }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text strong>Đạo diễn:</Text>
                    <br />
                    <Text>{movie.director}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Thời lượng:</Text>
                    <br />
                    <Text>{movie.duration} phút</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Ngày khởi chiếu:</Text>
                    <br />
                    <Text>{formatDate(movie.releaseDate)}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Đánh giá:</Text>
                    <br />
                    <Space>
                      <StarOutlined style={{ color: '#ffd700' }} />
                      <Text>{movie.rating}/10</Text>
                    </Space>
                  </Col>
                  <Col span={24}>
                    <Text strong>Diễn viên:</Text>
                    <br />
                    <Text>{movie.cast.join(', ')}</Text>
                  </Col>
                  <Col span={24}>
                    <Text strong>Thể loại:</Text>
                    <br />
                    <Space>
                      {movie.genre.map((g, index) => (
                        <Tag key={index} color="blue">{g}</Tag>
                      ))}
                    </Space>
                  </Col>
                </Row>
              </Card>

              {/* Mô tả chi tiết */}
              <Card title="Nội dung phim">
                <Paragraph style={{ fontSize: '15px', lineHeight: '1.6' }}>
                  {movie.description}
                </Paragraph>
              </Card>
            </Col>

            {/* Lịch chiếu */}
            <Col xs={24} lg={8}>
              <Card 
                title="Lịch chiếu hôm nay"
                extra={<VideoCameraOutlined />}
              >
                {showtimes.length === 0 ? (
                  <Alert
                    message="Chưa có lịch chiếu"
                    description="Phim này hiện chưa có lịch chiếu. Vui lòng quay lại sau."
                    type="info"
                    showIcon
                  />
                ) : (
                  Object.entries(groupedShowtimes).map(([cinema, times]) => (
                    <div key={cinema} style={{ marginBottom: '24px' }}>
                      <Title level={5} style={{ color: '#1890ff', marginBottom: '12px' }}>
                        🎭 {cinema}
                      </Title>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {times.map((showtime) => 
                          showtime.times.map((time, timeIndex) => (
                            <Button
                              key={`${showtime.id}-${timeIndex}`}
                              size="small"
                              onClick={() => handleBookTicket(showtime.id)}
                              style={{ minWidth: '70px' }}
                            >
                              {time}
                            </Button>
                          ))
                        )}
                      </div>
                      {cinema !== Object.keys(groupedShowtimes)[Object.keys(groupedShowtimes).length - 1] && (
                        <Divider style={{ margin: '16px 0' }} />
                      )}
                    </div>
                  ))
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default MovieDetailPage;