import React, { useState, useEffect } from 'react';
import { 
  Layout, Row, Col, Typography, Card, Button, Steps, Alert, 
  Spin, Space, Tag, Divider 
} from 'antd';
import { 
  CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined,
  UserOutlined, CreditCardOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import SeatSelector from '../../components/SeatSelector/SeatSelector';
import { showtimeApi, movieApi, seatApi } from '../../api/movieApi';
import { ROUTES } from '../../routes';

const { Content } = Layout;
const { Title, Text } = Typography;

const BookingPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Load dữ liệu showtime và movie
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy thông tin showtime
        const showtimeResponse = await showtimeApi.getShowtimeById(showtimeId);
        const showtimeData = showtimeResponse.data;
        setShowtime(showtimeData);

        // Lấy thông tin movie
        const movieResponse = await movieApi.getMovieById(showtimeData.movieId);
        setMovie(movieResponse.data);

        // Lấy trạng thái ghế đã đặt
        const seatResponse = await seatApi.getSeatStatus();
        const seatData = seatResponse.data;
        const showtimeBookedSeats = seatData[showtimeId] || {};
        
        // Lấy ghế đã đặt cho tất cả các suất chiếu của showtime này
        const allBookedSeats = Object.values(showtimeBookedSeats).flat();
        setBookedSeats(allBookedSeats);

      } catch (err) {
        setError('Không thể tải thông tin đặt vé');
        console.error('Error fetching booking data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showtimeId]);

  // Xử lý thay đổi ghế
  const handleSeatChange = ({ seats, totalPrice }) => {
    setSelectedSeats(seats);
    setTotalPrice(totalPrice);
  };

  // Tiến tới bước tiếp theo
  const handleNextStep = () => {
    if (selectedSeats.length === 0) {
      return;
    }
    setCurrentStep(1);
  };

  // Quay lại bước trước
  const handlePrevStep = () => {
    setCurrentStep(0);
  };

  // Tiến tới thanh toán
  const handleProceedToPayment = () => {
    // Lưu thông tin booking vào sessionStorage để sử dụng ở trang payment
    const bookingInfo = {
      showtimeId,
      movie: movie,
      showtime: showtime,
      selectedSeats,
      totalPrice
    };
    
    sessionStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
    navigate(ROUTES.PAYMENT);
  };

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Format ngày giờ
  const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <Content style={{ padding: '50px 5%' }}>
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <Spin size="large" />
            <p style={{ marginTop: '20px', color: '#666' }}>Đang tải thông tin đặt vé...</p>
          </div>
        </Content>
      </Layout>
    );
  }

  if (error || !showtime || !movie) {
    return (
      <Layout>
        <Content style={{ padding: '50px 5%' }}>
          <Alert
            message="Không thể tải thông tin đặt vé"
            description={error || "Suất chiếu không tồn tại."}
            type="error"
            showIcon
            action={
              <Button type="primary" onClick={() => navigate(-1)}>
                Quay lại
              </Button>
            }
          />
        </Content>
      </Layout>
    );
  }

  const steps = [
    {
      title: 'Chọn ghế',
      icon: <UserOutlined />
    },
    {
      title: 'Xác nhận',
      icon: <CreditCardOutlined />
    }
  ];

  return (
    <Layout>
      <Content style={{ padding: '20px 5%', background: '#f5f5f5' }}>
        {/* Header */}
        <Card style={{ marginBottom: '20px' }}>
          <Title level={2} style={{ margin: 0, textAlign: 'center' }}>
            Đặt vé xem phim
          </Title>
        </Card>

        {/* Steps */}
        <Card style={{ marginBottom: '20px' }}>
          <Steps current={currentStep} items={steps} />
        </Card>

        <Row gutter={[20, 20]}>
          {/* Main Content */}
          <Col xs={24} lg={16}>
            <Card>
              {currentStep === 0 ? (
                <>
                  <Title level={3} style={{ marginBottom: '20px' }}>
                    Chọn ghế ngồi
                  </Title>
                  <SeatSelector
                    showtimeId={showtimeId}
                    selectedTime={showtime.times[0]} // Sử dụng thời gian đầu tiên
                    onSeatChange={handleSeatChange}
                    bookedSeats={bookedSeats}
                  />
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button
                      type="primary"
                      size="large"
                      disabled={selectedSeats.length === 0}
                      onClick={handleNextStep}
                    >
                      Tiếp tục ({selectedSeats.length} ghế)
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Title level={3} style={{ marginBottom: '20px' }}>
                    Xác nhận thông tin đặt vé
                  </Title>
                  
                  {/* Thông tin phim */}
                  <div style={{ marginBottom: '20px' }}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={8}>
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          style={{
                            width: '100%',
                            maxWidth: '200px',
                            borderRadius: '8px'
                          }}
                        />
                      </Col>
                      <Col xs={24} sm={16}>
                        <Title level={4}>{movie.title}</Title>
                        <Space direction="vertical" size="small">
                          <Space>
                            <EnvironmentOutlined />
                            <Text>{showtime.cinema}</Text>
                          </Space>
                          <Space>
                            <CalendarOutlined />
                            <Text>{formatDateTime(showtime.date)}</Text>
                          </Space>
                          <Space>
                            <ClockCircleOutlined />
                            <Text>Suất chiếu: {showtime.times.join(', ')}</Text>
                          </Space>
                          <div>
                            <Text strong>Thể loại: </Text>
                            {movie.genre.map((g, index) => (
                              <Tag key={index} color="blue">{g}</Tag>
                            ))}
                          </div>
                          <Space>
                            <Text strong>Thời lượng:</Text>
                            <Text>{movie.duration} phút</Text>
                          </Space>
                          <Space>
                            <Text strong>Đánh giá:</Text>
                            <Text>⭐ {movie.rating}/10</Text>
                          </Space>
                        </Space>
                      </Col>
                    </Row>
                  </div>

                  <Divider />

                  {/* Thông tin ghế và giá */}
                  <div style={{ marginBottom: '20px' }}>
                    <Title level={5}>Chi tiết đặt vé</Title>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Text strong>Ghế đã chọn:</Text>
                        <br />
                        <Text style={{ fontSize: '16px', color: '#52c41a' }}>
                          {selectedSeats.sort().join(', ')}
                        </Text>
                      </Col>
                      <Col span={12}>
                        <Text strong>Số lượng vé:</Text>
                        <br />
                        <Text style={{ fontSize: '16px' }}>
                          {selectedSeats.length} vé
                        </Text>
                      </Col>
                      <Col span={24}>
                        <Alert
                          message="Tổng tiền thanh toán"
                          description={
                            <div>
                              <div style={{ marginBottom: '8px' }}>
                                <Text>Vé xem phim: {selectedSeats.length} x {formatPrice(90000)} = {formatPrice(totalPrice)}</Text>
                              </div>
                              <div>
                                <Text strong style={{ fontSize: '18px', color: '#f5222d' }}>
                                  Tổng cộng: {formatPrice(totalPrice)}
                                </Text>
                              </div>
                            </div>
                          }
                          type="info"
                          showIcon
                        />
                      </Col>
                    </Row>
                  </div>

                  {/* Action buttons */}
                  <div style={{ textAlign: 'center' }}>
                    <Space size="middle">
                      <Button size="large" onClick={handlePrevStep}>
                        Quay lại chọn ghế
                      </Button>
                      <Button
                        type="primary"
                        size="large"
                        onClick={handleProceedToPayment}
                      >
                        Tiến hành thanh toán
                      </Button>
                    </Space>
                  </div>
                </>
              )}
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            {/* Thông tin phim */}
            <Card 
              title="Thông tin phim"
              style={{ marginBottom: '20px' }}
              cover={
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  style={{ height: '700px', objectFit: 'cover' }}
                />
              }
            >
              <Title level={4} ellipsis>{movie.title}</Title>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div>
                  {movie.genre.map((g, index) => (
                    <Tag key={index} color="blue">{g}</Tag>
                  ))}
                </div>
                <Space>
                  <ClockCircleOutlined />
                  <Text>{movie.duration} phút</Text>
                </Space>
                <Space>
                  <Text>⭐ {movie.rating}/10</Text>
                </Space>
              </Space>
            </Card>

            {/* Thông tin suất chiếu */}
            <Card title="Thông tin suất chiếu">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong>Rạp chiếu phim:</Text>
                  <br />
                  <Text>{showtime.cinema}</Text>
                </div>
                <div>
                  <Text strong>Ngày chiếu:</Text>
                  <br />
                  <Text>{formatDateTime(showtime.date)}</Text>
                </div>
                <div>
                  <Text strong>Giờ chiếu:</Text>
                  <br />
                  <Space>
                    {showtime.times.map((time, index) => (
                      <Tag key={index} color="green">{time}</Tag>
                    ))}
                  </Space>
                </div>
              </Space>
            </Card>

            {/* Thông tin đặt vé */}
            {selectedSeats.length > 0 && (
              <Card title="Chi tiết đặt vé" style={{ marginTop: '20px' }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Ghế đã chọn:</Text>
                    <br />
                    <Text style={{ color: '#52c41a' }}>
                      {selectedSeats.sort().join(', ')}
                    </Text>
                  </div>
                  <div>
                    <Text strong>Số lượng:</Text>
                    <br />
                    <Text>{selectedSeats.length} vé</Text>
                  </div>
                  <Divider style={{ margin: '12px 0' }} />
                  <div>
                    <Text strong>Tổng tiền:</Text>
                    <br />
                    <Text style={{ fontSize: '18px', color: '#f5222d' }}>
                      {formatPrice(totalPrice)}
                    </Text>
                  </div>
                </Space>
              </Card>
            )}

            {/* Lưu ý */}
            <Alert
              message="Lưu ý"
              description={
                <ul style={{ margin: 0, paddingLeft: '16px' }}>
                  <li>Vé đã mua không được hoàn trả</li>
                  <li>Vui lòng có mặt trước giờ chiếu 15 phút</li>
                  <li>Mang theo giấy tờ tùy thân khi xem phim</li>
                  <li>Không mang thức ăn và đồ uống từ bên ngoài</li>
                </ul>
              }
              type="warning"
              showIcon
              style={{ marginTop: '20px' }}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default BookingPage;