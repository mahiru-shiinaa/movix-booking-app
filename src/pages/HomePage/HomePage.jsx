import React from 'react';
import { Layout, Row, Col, Typography, Carousel, Spin, Alert, Button } from 'antd';
import { PlayCircleOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../../components/MovieCard/MovieCard';
import { useMovies, useMoviesByStatus } from '../../hooks/useMovies';
import { ROUTES } from '../../routes';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const { movies: allMovies, loading: allLoading } = useMovies();
  const { movies: nowShowingMovies, loading: nowShowingLoading } = useMoviesByStatus('now-showing');
  const { movies: comingSoonMovies, loading: comingSoonLoading } = useMoviesByStatus('coming-soon');

  // Lấy phim nổi bật cho carousel (top rated movies)
  const featuredMovies = allMovies
    .filter(movie => movie.rating >= 8.5)
    .slice(0, 3);

  // Component Banner Slide
  const BannerSlide = ({ movie }) => (
    <div style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
      <div
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 5%'
        }}
      >
        <Row gutter={[32, 32]} align="middle" style={{ width: '100%' }}>
          <Col xs={24} md={12}>
            <div style={{ color: 'white' }}>
              <Title level={1} style={{ color: 'white', marginBottom: '16px' }}>
                {movie.title}
              </Title>
              <Paragraph 
                style={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  fontSize: '16px', 
                  marginBottom: '20px' 
                }}
              >
                {movie.description}
              </Paragraph>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ marginRight: '20px' }}>⭐ {movie.rating}/10</span>
                <span style={{ marginRight: '20px' }}>🕒 {movie.duration} phút</span>
                <span>{movie.genre.join(', ')}</span>
              </div>
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={() => navigate(`/movies/${movie.id}`)}
              >
                Xem chi tiết & Đặt vé
              </Button>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <img
              src={movie.posterUrl}
              alt={movie.title}
              style={{
                width: '100%',
                maxWidth: '400px',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }}
            />
          </Col>
        </Row>
      </div>
    </div>
  );

  // Component Section
  const MovieSection = ({ title, movies, loading, viewAllPath }) => (
    <div style={{ marginBottom: '50px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <Title level={2}>{title}</Title>
        {viewAllPath && (
          <Button 
            type="link" 
            icon={<RightOutlined />}
            onClick={() => navigate(viewAllPath)}
          >
            Xem tất cả
          </Button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : movies.length > 0 ? (
        <Row gutter={[16, 16]}>
          {movies.slice(0, 4).map(movie => (
            <Col xs={24} sm={12} md={6} key={movie.id}>
              <MovieCard movie={movie} />
            </Col>
          ))}
        </Row>
      ) : (
        <Alert
          message="Không có phim nào"
          description="Hiện tại chưa có phim trong danh mục này."
          type="info"
          showIcon
        />
      )}
    </div>
  );

  return (
    <Layout>
      <Content>
        {/* Hero Banner Carousel */}
        <section style={{ marginBottom: '50px' }}>
          {allLoading ? (
            <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin size="large" />
            </div>
          ) : featuredMovies.length > 0 ? (
            <Carousel 
              autoplay 
              autoplaySpeed={5000}
              effect="fade"
              dots={{ className: 'carousel-dots' }}
            >
              {featuredMovies.map(movie => (
                <BannerSlide key={movie.id} movie={movie} />
              ))}
            </Carousel>
          ) : (
            <div style={{
              height: '500px',
              background: 'linear-gradient(135deg, #1890ff, #096dd9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <div style={{ textAlign: 'center' }}>
                <Title level={1} style={{ color: 'white' }}>
                  🎬 Chào mừng đến với MOVIX
                </Title>
                <Paragraph style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)' }}>
                  Trải nghiệm điện ảnh tuyệt vời với công nghệ AI hiện đại
                </Paragraph>
              </div>
            </div>
          )}
        </section>

        {/* Main content */}
        <div style={{ padding: '0 5%' }}>
          {/* Phim đang chiếu */}
          <MovieSection
            title="🎬 Phim Đang Chiếu"
            movies={nowShowingMovies}
            loading={nowShowingLoading}
            viewAllPath={`${ROUTES.MOVIES}?status=now-showing`}
          />

          {/* Phim sắp chiếu */}
          <MovieSection
            title="🔜 Phim Sắp Chiếu"
            movies={comingSoonMovies}
            loading={comingSoonLoading}
            viewAllPath={`${ROUTES.MOVIES}?status=coming-soon`}
          />
        </div>
      </Content>

      {/* Custom styles for carousel */}
      <style jsx>{`
        .carousel-dots {
          bottom: 20px !important;
        }
        .carousel-dots li button {
          background: rgba(255,255,255,0.5) !important;
          border-radius: 50% !important;
          width: 12px !important;
          height: 12px !important;
        }
        .carousel-dots li.slick-active button {
          background: white !important;
        }
      `}</style>
    </Layout>
  );
};

export default HomePage;