// Định nghĩa các routes của ứng dụng
export const ROUTES = {
  HOME: '/',
  MOVIES: '/movies',
  MOVIE_DETAIL: '/movies/:id',
  BOOKING: '/booking/:showtimeId', 
  PAYMENT: '/payment'
};

// Hàm helper để tạo path với params
export const createPath = (route, params = {}) => {
  let path = route;
  
  // Thay thế các params trong route
  Object.keys(params).forEach(key => {
    path = path.replace(`:${key}`, params[key]);
  });
  
  return path;
};

export default ROUTES;