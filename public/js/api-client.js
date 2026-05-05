// public/js/api-client.js
const API_BASE = '/api/news';

const ApiClient = {
    // Chỉ phục vụ load danh sách phân trang ngoài trang chủ
    async fetchNewsPage(page, limit) {
        const response = await fetch(`${API_BASE}?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error('Lỗi kết nối API danh sách');
        return await response.json();
    }
};