import React, { useState, useEffect } from 'react';
import { Typography, Space, Alert } from 'antd';
import './style.css';

const { Text } = Typography;

const SeatSelector = ({ showtimeId, selectedTime, onSeatChange, bookedSeats = [] }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const SEAT_PRICE = 90000; // Giá vé: 90,000 VND
  
  // Tạo lưới ghế 10x10 (A-J, 1-10)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 10;

  // SỬA LỖI: Xử lý click ghế
  const handleSeatClick = (seatId) => {
    // Không cho phép chọn ghế đã được đặt
    if (bookedSeats.includes(seatId)) {
      return;
    }

    let newSelectedSeats;
    if (selectedSeats.includes(seatId)) {
      // Bỏ chọn ghế
      newSelectedSeats = selectedSeats.filter(seat => seat !== seatId);
    } else {
      // Chọn ghế (giới hạn tối đa 6 ghế)
      if (selectedSeats.length >= 6) {
        alert('Bạn chỉ có thể chọn tối đa 6 ghế');
        return;
      }
      newSelectedSeats = [...selectedSeats, seatId];
    }

    setSelectedSeats(newSelectedSeats);
    
    // SỬA LỖI: Callback to parent component
    if (onSeatChange && typeof onSeatChange === 'function') {
      onSeatChange({
        seats: newSelectedSeats,
        totalPrice: newSelectedSeats.length * SEAT_PRICE
      });
    }
  };

  // Xác định trạng thái ghế
  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return 'booked';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  // Xác định CSS class cho ghế
  const getSeatClass = (seatId) => {
    const status = getSeatStatus(seatId);
    const row = seatId.charAt(0);
    
    let classes = 'seat';
    
    // Thêm class theo trạng thái
    classes += ` seat-${status}`;
    
    // Thêm class cho ghế VIP (hàng G, H, I)
    if (['G', 'H', 'I'].includes(row)) {
      classes += ' seat-vip';
    }

    return classes;
  };

  // Format số tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // SỬA LỖI: Reset selected seats khi thay đổi showtime - loại bỏ onSeatChange khỏi dependency
  useEffect(() => {
    setSelectedSeats([]);
    if (onSeatChange && typeof onSeatChange === 'function') {
      onSeatChange({
        seats: [],
        totalPrice: 0
      });
    }
  }, [showtimeId, selectedTime]);

  return (
    <div className="seat-selector">
      {/* Màn hình */}
      <div className="screen">
        <div className="screen-text">MÀN HÌNH</div>
      </div>

      {/* Lưới ghế */}
      <div className="seats-container">
        {rows.map(row => (
          <div key={row} className="seat-row">
            <div className="row-label">{row}</div>
            <div className="seats">
              {Array.from({ length: seatsPerRow }, (_, i) => {
                const seatId = `${row}${i + 1}`;
                const isVipRow = ['G', 'H', 'I'].includes(row);
                
                return (
                  <div
                    key={seatId}
                    className={getSeatClass(seatId)}
                    onClick={() => handleSeatClick(seatId)}
                    title={`Ghế ${seatId}${isVipRow ? ' (VIP)' : ''}`}
                    style={{ cursor: bookedSeats.includes(seatId) ? 'not-allowed' : 'pointer' }}
                  >
                    <span className="seat-number">{i + 1}</span>
                  </div>
                );
              })}
            </div>
            <div className="row-label">{row}</div>
          </div>
        ))}
      </div>

      {/* Chú thích */}
      <div className="legend">
        <Space size="large" wrap>
          <Space>
            <div className="seat seat-available legend-seat"></div>
            <Text>Ghế trống</Text>
          </Space>
          <Space>
            <div className="seat seat-selected legend-seat"></div>
            <Text>Ghế đang chọn</Text>
          </Space>
          <Space>
            <div className="seat seat-booked legend-seat"></div>
            <Text>Ghế đã đặt</Text>
          </Space>
          <Space>
            <div className="seat seat-available seat-vip legend-seat"></div>
            <Text>Ghế VIP</Text>
          </Space>
        </Space>
      </div>

      {/* Thông tin đặt chỗ */}
      {selectedSeats.length > 0 && (
        <div className="booking-info">
          <Alert
            message="Thông tin đặt ghế"
            description={
              <div>
                <Text strong>Ghế đã chọn: </Text>
                <Text>{selectedSeats.sort().join(', ')}</Text>
                <br />
                <Text strong>Số lượng: </Text>
                <Text>{selectedSeats.length} ghế</Text>
                <br />
                <Text strong>Tổng tiền: </Text>
                <Text style={{ fontSize: '16px', color: '#f5222d' }}>
                  {formatPrice(selectedSeats.length * SEAT_PRICE)}
                </Text>
              </div>
            }
            type="info"
            showIcon
            style={{ marginTop: '20px' }}
          />
        </div>
      )}

      {/* Lưu ý */}
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          * Bạn có thể chọn tối đa 6 ghế cho một lần đặt vé
          <br />
          * Ghế VIP (hàng G, H, I) có giá {formatPrice(SEAT_PRICE)}
          <br />
          * Ghế thường có giá {formatPrice(SEAT_PRICE)}
        </Text>
      </div>
    </div>
  );
};

export default SeatSelector;