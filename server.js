// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose'); // [MỚI] 1. Nạp thư viện Mongoose để làm việc với Database

// Tự động cấu hình đọc file .env nếu có (giúp linh hoạt chọn PORT khi deploy)
require('dotenv').config({ silent: true });

const app = express();
// Ưu tiên PORT của hệ thống hosting cấp, nếu không có mới dùng PORT trong .env hoặc mặc định 3000
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Định tuyến nạp toàn bộ thư mục tĩnh Frontend (public/)
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// [MỚI] CONFIG & CONNECT DATABASE (MONGODB)
// ==========================================
// Lấy chuỗi kết nối từ file .env bảo mật, nếu chạy dưới local chưa có sẽ tự động dùng db tên là 'web_msg_spa'
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/web_msg_spa';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('🍃 KẾT NỐI DATABASE MONGODB THÀNH CÔNG!'))
    .catch(err => console.error('❌ LỖI KẾT NỐI DATABASE MONGODB:', err));

// ==========================================
// [MỚI] DEFINE SCHEMAS & MODELS (Khuôn mẫu dữ liệu)
// ==========================================
const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=600' },
    date: { type: String, default: () => new Date().toLocaleDateString('vi-VN') }
});

// Tạo Model 'News' đại diện cho bảng chứa danh sách tin tức trong Database
const News = mongoose.model('News', NewsSchema);


// ==========================================
// API ENDPOINTS - Hệ thống API cung cấp dữ liệu
// ==========================================

// [SỬA ĐỔI] API lấy danh sách bài viết (Chuyển sang lấy từ MongoDB bằng async/await)
app.get('/api/news', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        
        // Nếu yêu cầu lấy toàn bộ dữ liệu (limit = 999) để tìm kiếm hoặc hiển thị hết
        if (limit === 999) {
            const allNews = await News.find({}).sort({ _id: -1 }); // Lấy hết bài viết, bài mới nhất xếp lên đầu
            return res.json({ data: allNews });
        }

        const startIndex = (page - 1) * limit;
        
        // 1. Lấy tổng số lượng bài viết đang có trong Database thật
        const totalItems = await News.countDocuments();

        // 2. Truy vấn dữ liệu có phân trang, bỏ qua (skip) các bài cũ và giới hạn (limit) số bài lấy ra
        const dbNews = await News.find({})
            .sort({ _id: -1 }) // Sắp xếp bài mới đăng lên đầu tiên
            .skip(startIndex)
            .limit(limit);

        const results = {
            totalItems: totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
            data: dbNews
        };

        res.json(results);
    } catch (error) {
        console.error("❌ LỖI API LẤY TIN TỨC:", error);
        res.status(500).json({ error: "Lỗi hệ thống không thể lấy dữ liệu từ Database." });
    }
});

// Cấu hình dự phòng (Fallback): Mọi đường dẫn không khớp API sẽ tự trả về index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Khởi chạy hệ thống máy chủ
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 SERVER CHẠY THÀNH CÔNG TRÊN PRODUCTION!`);
    console.log(`🌍 Địa chỉ truy cập tại: http://localhost:${PORT}`);
    console.log(`==================================================`);
});