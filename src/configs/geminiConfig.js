import { GoogleGenerativeAI } from '@google/generative-ai';

// Cấu hình API key cho Google Gemini
const GEMINI_API_KEY = 'AIzaSyDRnMVdyb65UmAyizZeMJ5iteOueteOG9U';

// Khởi tạo Google Generative AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Lấy model Gemini Pro
export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

export default genAI;