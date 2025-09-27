import React, { useState, useEffect } from 'react';
import { 
  Layout, Row, Col, Typography, Card, Button, Form, Input, 
  Radio, Alert, Modal, Result, Spin, Space, Tag, Divider 
} from 'antd';
import { 
  CreditCardOutlined, UserOutlined, MailOutlined, PhoneOutlined,
  BankOutlined, CheckCircleOutlined, CalendarOutlined, 
  ClockCircleOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../../api/movieApi';
import { ROUTES } from '../../routes';

const { Content } = Layout;
const { Title, Text } = Typography;

const PaymentPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // States
  const [loading, setLoading] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load booking info từ sessionStorage
  useEffect(() => {
    const storedInfo = sessionStorage.getItem('bookingInfo');
    if (storedInfo) {
      setBookingInfo(JSON.parse(storedInfo));
    } else {
      // Nếu không có thông tin booking, redirect về trang chủ
      Modal.warning({
        title: 'Không có thông tin đặt vé',
        content: 'Vui lòng chọn phim và ghế trước khi thanh toán.',
        onOk: () => navigate(ROUTES.HOME)
      });
    }
  }, [navigate]);

  // Xử lý thanh toán
  const handlePayment = async (values) => {
    if (!bookingInfo) return;

    try {
      setLoading(true);

      // Tạo booking data
      const bookingData = {
        showtimeId: bookingInfo.showtimeId,
        selectedSeats: bookingInfo.selectedSeats,
        totalPrice: bookingInfo.totalPrice,
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone || '',
        paymentMethod: paymentMethod,
        bookingTime: new Date().toISOString()
      };

      // Giả lập API call (thực tế sẽ gọi API thanh toán thật)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Gọi API tạo booking
      await bookingApi.createBooking(bookingData);

      // Xóa thông tin booking từ sessionStorage
      sessionStorage.removeItem('bookingInfo');

      // Hiển thị modal thành công
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Payment error:', error);
      Modal.error({
        title: 'Thanh toán thất bại',
        content: 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi đóng modal thành công
  const handleSuccessModalOk = () => {
    setShowSuccessModal(false);
    navigate(ROUTES.HOME);
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

  if (!bookingInfo) {
    return (
      <Layout>
        <Content style={{ padding: '50px 5%' }}>
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <Spin size="large" />
            <p style={{ marginTop: '20px', color: '#666' }}>Đang tải thông tin thanh toán...</p>
          </div>
        </Content>
      </Layout>
    );
  }

  const { movie, showtime, selectedSeats, totalPrice } = bookingInfo;

  return (
    <Layout>
      <Content style={{ padding: '20px 5%', background: '#f5f5f5' }}>
        {/* Header */}
        <Card style={{ marginBottom: '20px' }}>
          <Title level={2} style={{ margin: 0, textAlign: 'center' }}>
            <CreditCardOutlined /> Thanh toán
          </Title>
        </Card>

        <Row gutter={[20, 20]}>
          {/* Form thanh toán */}
          <Col xs={24} lg={14}>
            <Card title="Thông tin thanh toán">
              <Form
                form={form}
                layout="vertical"
                onFinish={handlePayment}
                initialValues={{
                  customerName: '',
                  customerEmail: '',
                  customerPhone: ''
                }}
              >
                {/* Thông tin khách hàng */}
                <Title level={4}>
                  <UserOutlined /> Thông tin khách hàng
                </Title>

                <Row gutter={[16, 0]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Họ và tên"
                      name="customerName"
                      rules={[
                        { required: true, message: 'Vui lòng nhập họ và tên' },
                        { min: 2, message: 'Tên phải có ít nhất 2 ký tự' }
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Nguyễn Văn A"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Email"
                      name="customerEmail"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' }
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="example@email.com"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      label="Số điện thoại (tùy chọn)"
                      name="customerPhone"
                      rules={[
                        { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                      ]}
                    >
                      <Input
                        prefix={<PhoneOutlined />}
                        placeholder="0123456789"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                {/* Phương thức thanh toán */}
                <Title level={4}>
                  <CreditCardOutlined /> Phương thức thanh toán
                </Title>

                <Radio.Group
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Radio value="card">
                      <CreditCardOutlined /> Thẻ tín dụng / Thẻ ghi nợ
                    </Radio>
                    <Radio value="banking">
                      <BankOutlined /> Chuyển khoản ngân hàng
                    </Radio>
                    <Radio value="ewallet">
                      📱 Ví điện tử (MoMo, ZaloPay, VNPay)
                    </Radio>
                  </Space>
                </Radio.Group>

                {/* Thông tin thanh toán giả lập */}
                {paymentMethod === 'card' && (
                  <Alert
                    message="Thanh toán thẻ"
                    description="Đây là demo - không yêu cầu thông tin thẻ thật. Nhấn 'Xác nhận thanh toán' để hoàn tất."
                    type="info"
                    showIcon
                    style={{ marginTop: '16px' }}
                  />
                )}

                {paymentMethod === 'banking' && (
                  <Alert
                    message="Chuyển khoản ngân hàng"
                    description="Đây là demo - không có giao dịch thật. Nhấn 'Xác nhận thanh toán' để hoàn tất."
                    type="info"
                    showIcon
                    style={{ marginTop: '16px' }}
                  />
                )}

                {paymentMethod === 'ewallet' && (
                  <Alert
                    message="Ví điện tử"
                    description="Đây là demo - không kết nối ví thật. Nhấn 'Xác nhận thanh toán' để hoàn tất."
                    type="info"
                    showIcon
                    style={{ marginTop: '16px' }}
                  />
                )}

                <Divider />

                {/* Nút thanh toán */}
                <Form.Item>
                  <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
                    <Button 
                      size="large" 
                      onClick={() => navigate(-1)}
                    >
                      Quay lại
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      icon={<CheckCircleOutlined />}
                    >
                      {loading ? 'Đang xử lý...' : `Xác nhận thanh toán ${formatPrice(totalPrice)}`}
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Tóm tắt đơn hàng */}
          <Col xs={24} lg={10}>
            {/* Thông tin phim */}
            <Card 
              title="Thông tin đặt vé"
              style={{ marginBottom: '20px' }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={`https://via.placeholder.com/200x300/1890ff/ffffff?text=${encodeURIComponent(movie.title)}`}
                    alt={movie.title}
                    style={{
                      width: '150px',
                      borderRadius: '8px',
                      marginBottom: '12px'
                    }}
                  />
                  <Title level={4} style={{ margin: 0 }}>{movie.title}</Title>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div>
                  <Space>
                    <EnvironmentOutlined />
                    <Text strong>Rạp:</Text>
                    <Text>{showtime.cinema}</Text>
                  </Space>
                </div>

                <div>
                  <Space>
                    <CalendarOutlined />
                    <Text strong>Ngày:</Text>
                    <Text>{formatDateTime(showtime.date)}</Text>
                  </Space>
                </div>

                <div>
                  <Space>
                    <ClockCircleOutlined />
                    <Text strong>Giờ:</Text>
                    {showtime.times.map((time, index) => (
                      <Tag key={index} color="blue">{time}</Tag>
                    ))}
                  </Space>
                </div>

                <div>
                  <Text strong>Ghế đã chọn:</Text>
                  <br />
                  <Space wrap>
                    {selectedSeats.sort().map((seat, index) => (
                      <Tag key={index} color="green" style={{ margin: '2px' }}>
                        {seat}
                      </Tag>
                    ))}
                  </Space>
                </div>

                <div>
                  <Text strong>Số lượng vé:</Text>
                  <Text style={{ marginLeft: '8px' }}>{selectedSeats.length} vé</Text>
                </div>
              </Space>
            </Card>

            {/* Tổng thanh toán */}
            <Card title="Chi tiết thanh toán">
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Vé xem phim ({selectedSeats.length} vé):</Text>
                  <Text>{formatPrice(totalPrice)}</Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Phí dịch vụ:</Text>
                  <Text>{formatPrice(0)}</Text>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  <Text strong>Tổng thanh toán:</Text>
                  <Text strong style={{ color: '#f5222d', fontSize: '20px' }}>
                    {formatPrice(totalPrice)}
                  </Text>
                </div>
              </Space>
            </Card>

            {/* Lưu ý */}
            <Alert
              message="Lưu ý quan trọng"
              description={
                <ul style={{ margin: 0, paddingLeft: '16px' }}>
                  <li>Đây là ứng dụng demo, không có giao dịch thanh toán thật</li>
                  <li>Thông tin được nhập chỉ để mục đích thử nghiệm</li>
                  <li>Vé đã "mua" chỉ tồn tại trong phiên làm việc này</li>
                </ul>
              }
              type="warning"
              showIcon
              style={{ marginTop: '20px' }}
            />
          </Col>
        </Row>

        {/* Modal thành công */}
        <Modal
          open={showSuccessModal}
          onOk={handleSuccessModalOk}
          onCancel={handleSuccessModalOk}
          footer={[
            <Button key="ok" type="primary" size="large" onClick={handleSuccessModalOk}>
              Về trang chủ
            </Button>
          ]}
          width={500}
          centered
        >
          <Result
            status="success"
            title="Đặt vé thành công!"
            subTitle={
              <div>
                <p>Cảm ơn bạn đã sử dụng dịch vụ Movix!</p>
                <p><strong>Mã đặt vé:</strong> MV{Date.now()}</p>
                <p><strong>Phim:</strong> {movie.title}</p>
                <p><strong>Ghế:</strong> {selectedSeats.sort().join(', ')}</p>
                <p><strong>Tổng tiền:</strong> <span style={{color: '#f5222d'}}>{formatPrice(totalPrice)}</span></p>
              </div>
            }
          />
        </Modal>
      </Content>
    </Layout>
  );
};

export default PaymentPage;