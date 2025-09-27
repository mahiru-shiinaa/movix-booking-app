import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Typography, Spin, Alert, Select, Input, Space, Card } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../../components/MovieCard/MovieCard';
import { useMovies, useMovieSearch } from '../../hooks/useMovies';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const MovieListPage = () => {
  const [searchParams] = useSearchParams();
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('title');

  // Hooks
  const { movies, loading, error } = useMovies();
  const { results: searchResults, searchMovies, loading: searchLoading } = useMovieSearch();

  // Lấy query parameters
  const searchQuery = searchParams.get('search') || '';
  const statusQuery = searchParams.get('status') || '';

  // Lấy danh sách thể loại unique
  const genres = ['all', ...new Set(movies.flatMap(movie => movie.genre))];

  // Effect để xử lý search và filter - SỬA LỖI: thêm dependency và logic rõ ràng hơn
  useEffect(() => {
    // Nếu có search query, chỉ search một lần
    if (searchQuery) {
      searchMovies(searchQuery);
      return;
    }

    // Nếu không có search query, filter từ movies
    let result = movies;

    // Filter theo status từ URL params
    if (statusQuery && statusQuery !== 'all') {
      result = result.filter(movie => movie.status === statusQuery);
      if (selectedStatus !== statusQuery) {
        setSelectedStatus(statusQuery);
      }
    }

    // Filter theo genre
    if (selectedGenre !== 'all') {
      result = result.filter(movie => 
        movie.genre.some(g => g === selectedGenre)
      );
    }

    // Filter theo status (dropdown)
    if (selectedStatus !== 'all' && !statusQuery) {
      result = result.filter(movie => movie.status === selectedStatus);
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating - a.rating;
        case 'releaseDate':
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        case 'duration':
          return b.duration - a.duration;
        default:
          return 0;
      }
    });

    setFilteredMovies(result);
  }, [movies, searchQuery, selectedGenre, selectedStatus, sortBy, statusQuery]);

  // Effect riêng để xử lý search results - SỬA LỖI: tách riêng để tránh conflict
  useEffect(() => {
    if (searchQuery && searchResults.length >= 0) {
      setFilteredMovies(searchResults);
    }
  }, [searchResults, searchQuery]);

  // Xử lý local search (không thông qua URL)
  const handleLocalSearch = (value) => {
    if (value.trim()) {
      searchMovies(value);
    } else {
      // Reset về movies ban đầu nếu xóa search
      setFilteredMovies(movies);
    }
  };

  const isLoading = loading || searchLoading;
  const displayMovies = searchQuery ? searchResults : filteredMovies;

  // Get page title based on filters
  const getPageTitle = () => {
    if (searchQuery) return `Kết quả tìm kiếm: "${searchQuery}"`;
    if (statusQuery === 'now-showing') return 'Phim Đang Chiếu';
    if (statusQuery === 'coming-soon') return 'Phim Sắp Chiếu';
    if (selectedStatus === 'now-showing') return 'Phim Đang Chiếu';
    if (selectedStatus === 'coming-soon') return 'Phim Sắp Chiếu';
    return 'Tất Cả Phim';
  };

  return (
    <Layout>
      <Content style={{ padding: '20px 5%' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <Title level={1}>{getPageTitle()}</Title>
        </div>

        {/* Filters and Search */}
        <Card style={{ marginBottom: '30px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <Search
                placeholder="Tìm kiếm phim..."
                allowClear
                enterButton={<SearchOutlined />}
                size="middle"
                onSearch={handleLocalSearch}
                defaultValue={searchQuery}
              />
            </Col>
            
            <Col xs={24} sm={8} md={4}>
              <Select
                style={{ width: '100%' }}
                placeholder="Thể loại"
                value={selectedGenre}
                onChange={setSelectedGenre}
                suffixIcon={<FilterOutlined />}
              >
                <Option value="all">Tất cả thể loại</Option>
                {genres.slice(1).map(genre => (
                  <Option key={genre} value={genre}>{genre}</Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={8} md={4}>
              <Select
                style={{ width: '100%' }}
                placeholder="Trạng thái"
                value={selectedStatus}
                onChange={setSelectedStatus}
              >
                <Option value="all">Tất cả phim</Option>
                <Option value="now-showing">Đang chiếu</Option>
                <Option value="coming-soon">Sắp chiếu</Option>
              </Select>
            </Col>

            <Col xs={24} sm={8} md={4}>
              <Select
                style={{ width: '100%' }}
                placeholder="Sắp xếp"
                value={sortBy}
                onChange={setSortBy}
              >
                <Option value="title">Tên phim A-Z</Option>
                <Option value="rating">Đánh giá cao</Option>
                <Option value="releaseDate">Mới nhất</Option>
                <Option value="duration">Thời lượng</Option>
              </Select>
            </Col>

            <Col xs={24} md={4}>
              <Space>
                <span style={{ color: '#666' }}>
                  Tìm thấy: {displayMovies.length} phim
                </span>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Movies Grid */}
        {error ? (
          <Alert
            message="Lỗi tải dữ liệu"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        ) : isLoading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <Spin size="large" />
            <p style={{ marginTop: '20px', color: '#666' }}>Đang tải danh sách phim...</p>
          </div>
        ) : displayMovies.length > 0 ? (
          <Row gutter={[16, 16]}>
            {displayMovies.map(movie => (
              <Col xs={24} sm={12} md={8} lg={6} key={movie.id}>
                <MovieCard movie={movie} />
              </Col>
            ))}
          </Row>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <Alert
              message={searchQuery ? "Không tìm thấy phim nào" : "Không có phim nào"}
              description={
                searchQuery 
                  ? `Không tìm thấy phim nào với từ khóa "${searchQuery}"`
                  : "Hiện tại không có phim nào phù hợp với bộ lọc đã chọn."
              }
              type="info"
              showIcon
            />
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default MovieListPage;