// src/services/geminiService.js

import { GoogleGenerativeAI } from '@google/generative-ai';
import { movieApi } from '../api/movieApi';

// 🔑 Cấu hình API key
const GEMINI_API_KEY = 'AIzaSyDRnMVdyb65UmAyizZeMJ5iteOueteOG9U'; // Thay bằng key của bạn

// 🚀 Khởi tạo Google Generative AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// 📌 Biến lưu prompt hệ thống
let systemPrompt = '';

// 📌 Hàm cập nhật prompt hệ thống dựa vào dữ liệu phim
const updateSystemPrompt = (movies) => {
  const movieDataString = JSON.stringify({ movies }, null, 2);

  systemPrompt = `
Bạn là trợ lý AI thông minh của hệ thống đặt vé xem phim Movix. Nhiệm vụ của bạn là:

1. TƯ VẤN VÀ GỢI Ý PHIM:
   - Gợi ý phim phù hợp với sở thích, thể loại, tâm trạng
   - So sánh và đánh giá các bộ phim
   - Giải thích nội dung, diễn viên, đạo diễn

2. HỖ TRỢ ĐẶT VÉ:
   - Hướng dẫn quy trình đặt vé
   - Giải thích các bước chọn ghế, thanh toán
   - Trả lời câu hỏi về lịch chiếu, rạp phim

3. DỮ LIỆU PHIM HIỆN TẠI:
${movieDataString}

HƯỚNG DẪN TRẢ LỜI:
- Luôn thân thiện, nhiệt tình và hữu ích
- Sử dụng emoji phù hợp để tạo không khí vui vẻ
- Trả lời bằng tiếng Việt tự nhiên
- Đưa ra gợi ý cụ thể dựa trên dữ liệu phim
- Nếu không có thông tin, hãy thẳng thắn nói và gợi ý người dùng liên hệ nhân viên

Hãy trả lời ngắn gọn, súc tích nhưng đầy đủ thông tin!
`;
};

/**
 * Lấy dữ liệu phim từ API và cập nhật system prompt
 */
export const initializeChatbotData = async () => {
  try {
    const response = await movieApi.getAllMovies();
    const essentialMovieData = response.data.map(movie => ({
      id: movie.id,
      title: movie.title,
      director: movie.director,
      genre: movie.genre,
      rating: movie.rating,
      status: movie.status,
      linkTrailer: movie.trailerUrl,
      description: movie.description.substring(0, 150) + '...'
    }));
    updateSystemPrompt(essentialMovieData);
    console.log('Chatbot data updated successfully with new movies.');
  } catch (error) {
    console.error('Failed to initialize chatbot with movie data:', error);
    updateSystemPrompt([]);
  }
};

/**
 * Gửi tin nhắn người dùng tới Gemini và nhận phản hồi
 */
export const askGemini = async (userMessage) => {
  try {
    if (!systemPrompt) {
      await initializeChatbotData();
    }

    // ✅ Đổi model: "gemini-1.5-flash" hoặc "gemini-1.5-pro"
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const fullPrompt = `${systemPrompt}\n\nCâu hỏi từ khách hàng: ${userMessage}`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    return text;

  } catch (error) {
    console.error('Lỗi khi gọi Gemini API:', error);

    if (error.message?.includes('API key')) {
      return 'Xin lỗi, có vấn đề với API key. Vui lòng liên hệ quản trị viên! 🔧';
    } else if (error.message?.includes('quota')) {
      return 'Hệ thống đang bận, vui lòng thử lại sau ít phút! ⏰';
    } else if (error.message?.includes('network') || error.message?.includes('503')) {
      return 'Có vấn đề kết nối đến trợ lý AI. Vui lòng kiểm tra kết nối và thử lại! 🌐';
    } else {
      return 'Xin lỗi, tôi gặp chút trục trặc kỹ thuật. Vui lòng thử lại hoặc liên hệ nhân viên hỗ trợ! 🤖💔';
    }
  }
};

export default {
  askGemini,
  initializeChatbotData,
};
