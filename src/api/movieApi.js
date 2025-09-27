// Base API URL cho json-server
const BASE_URL = 'http://localhost:3001';

// Helper function để xử lý response
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// Movie API
export const movieApi = {
  // Lấy tất cả phim
  getAllMovies: async () => {
    const response = await fetch(`${BASE_URL}/movies`);
    return { data: await handleResponse(response) };
  },

  // Lấy phim theo ID
  getMovieById: async (id) => {
    const response = await fetch(`${BASE_URL}/movies/${id}`);
    return { data: await handleResponse(response) };
  },

  // Lấy phim theo status
  getMoviesByStatus: async (status) => {
    const response = await fetch(`${BASE_URL}/movies?status=${status}`);
    return { data: await handleResponse(response) };
  },

  // Tìm kiếm phim
  searchMovies: async (query) => {
    const response = await fetch(`${BASE_URL}/movies`);
    const movies = await handleResponse(response);
    
    // Tìm kiếm trong title, genre, cast, director
    const filtered = movies.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.genre.some(g => g.toLowerCase().includes(query.toLowerCase())) ||
      movie.cast.some(c => c.toLowerCase().includes(query.toLowerCase())) ||
      movie.director.toLowerCase().includes(query.toLowerCase())
    );
    
    return { data: filtered };
  }
};

// Showtime API
export const showtimeApi = {
  // Lấy tất cả suất chiếu
  getAllShowtimes: async () => {
    const response = await fetch(`${BASE_URL}/showtimes`);
    return { data: await handleResponse(response) };
  },

  // Lấy suất chiếu theo ID
  getShowtimeById: async (id) => {
    const response = await fetch(`${BASE_URL}/showtimes/${id}`);
    return { data: await handleResponse(response) };
  },

  // Lấy suất chiếu theo movieId
  getShowtimesByMovieId: async (movieId) => {
    const response = await fetch(`${BASE_URL}/showtimes?movieId=${movieId}`);
    return { data: await handleResponse(response) };
  }
};

// Seat API
export const seatApi = {
  // Lấy trạng thái ghế
  getSeatStatus: async () => {
    const response = await fetch(`${BASE_URL}/seatStatus`);
    return { data: await handleResponse(response) };
  },

  // Cập nhật trạng thái ghế (giả lập)
  updateSeatStatus: async (showtimeId, time, seats) => {
    // Trong thực tế sẽ gọi API PATCH/PUT
    console.log('Update seat status:', { showtimeId, time, seats });
    return { success: true };
  }
};

// Booking API
export const bookingApi = {
  // Lấy tất cả booking
  getAllBookings: async () => {
    const response = await fetch(`${BASE_URL}/bookings`);
    return { data: await handleResponse(response) };
  },

  // Tạo booking mới
  createBooking: async (bookingData) => {
    const response = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...bookingData,
        id: Date.now(), // Tạo ID giả lập
        createdAt: new Date().toISOString()
      }),
    });
    return { data: await handleResponse(response) };
  },

  // Lấy booking theo ID
  getBookingById: async (id) => {
    const response = await fetch(`${BASE_URL}/bookings/${id}`);
    return { data: await handleResponse(response) };
  }
};

// Export default
export default {
  movieApi,
  showtimeApi,
  seatApi,
  bookingApi
};