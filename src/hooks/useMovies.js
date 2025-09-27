import { useState, useEffect } from 'react';
import { movieApi, showtimeApi } from '../api/movieApi';

// Custom hook để lấy dữ liệu phim
export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm fetch tất cả phim
  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await movieApi.getAllMovies();
      setMovies(response.data);
    } catch (err) {
      setError('Không thể tải danh sách phim');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return {
    movies,
    loading,
    error,
    refetch: fetchMovies
  };
};

// Custom hook để lấy phim theo status
export const useMoviesByStatus = (status) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesByStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await movieApi.getMoviesByStatus(status);
      setMovies(response.data);
    } catch (err) {
      setError('Không thể tải danh sách phim');
      console.error('Error fetching movies by status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status) {
      fetchMoviesByStatus();
    }
  }, [status]);

  return {
    movies,
    loading,
    error,
    refetch: fetchMoviesByStatus
  };
};

// Custom hook để lấy chi tiết phim
export const useMovieDetail = (movieId) => {
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovieDetail = async () => {
    if (!movieId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch movie detail và showtimes song song
      const [movieResponse, showtimesResponse] = await Promise.all([
        movieApi.getMovieById(movieId),
        showtimeApi.getShowtimesByMovieId(movieId)
      ]);

      setMovie(movieResponse.data);
      setShowtimes(showtimesResponse.data);
    } catch (err) {
      setError('Không thể tải thông tin phim');
      console.error('Error fetching movie detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieDetail();
  }, [movieId]);

  return {
    movie,
    showtimes,
    loading,
    error,
    refetch: fetchMovieDetail
  };
};

// Custom hook để tìm kiếm phim
export const useMovieSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchMovies = async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await movieApi.searchMovies(query);
      setResults(response.data);
    } catch (err) {
      setError('Không thể tìm kiếm phim');
      console.error('Error searching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return {
    results,
    loading,
    error,
    searchMovies,
    clearResults
  };
};