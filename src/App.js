import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Chatbot from './components/Chatbot/Chatbot';

// Pages
import HomePage from './pages/HomePage/HomePage';
import MovieListPage from './pages/MovieListPage/MovieListPage';
import MovieDetailPage from './pages/MovieDetailPage/MovieDetailPage';
import BookingPage from './pages/BookingPage/BookingPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';

// Routes
import { ROUTES } from './routes';

// Styles
import 'antd/dist/reset.css';
import './App.css';

const { Content: AntContent } = Layout;

function App() {
  return (
    <ConfigProvider 
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segui UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      }}
    >
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Navbar />
          
          <AntContent style={{ flex: 1 }}>
            <Routes>
              {/* Trang chủ */}
              <Route path={ROUTES.HOME} element={<HomePage />} />
              
              {/* Danh sách phim */}
              <Route path={ROUTES.MOVIES} element={<MovieListPage />} />
              
              {/* Chi tiết phim */}
              <Route path={ROUTES.MOVIE_DETAIL} element={<MovieDetailPage />} />
              
              {/* Đặt vé */}
              <Route path={ROUTES.BOOKING} element={<BookingPage />} />
              
              {/* Thanh toán */}
              <Route path={ROUTES.PAYMENT} element={<PaymentPage />} />
              
              {/* 404 - Trang không tìm thấy */}
              <Route path="*" element={
                <div style={{ 
                  padding: '100px 20px', 
                  textAlign: 'center',
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <h1 style={{ fontSize: '72px', margin: 0, color: '#ccc' }}>404</h1>
                  <h2 style={{ color: '#666' }}>Trang không tìm thấy</h2>
                  <p style={{ color: '#999', marginBottom: '20px' }}>
                    Trang bạn đang tìm kiếm không tồn tại.
                  </p>
                  <a href="/" style={{ color: '#1890ff' }}>Về trang chủ</a>
                </div>
              } />
            </Routes>
          </AntContent>
          
          <Footer />
          
          {/* AI Chatbot - floating */}
          <Chatbot />
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;