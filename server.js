// server.js
const express = require('express');
const path = require('path');
const cors = require('cors'); // [THÊM] Thư viện giúp Frontend gọi được Backend
const mongoose = require('mongoose');

// Tự động cấu hình đọc file .env
require('dotenv').config({ silent: true });

const app = express();
const PORT = process.env.PORT || 3000;

// [QUAN TRỌNG] Cho phép Frontend truy cập API từ mọi nguồn (tránh lỗi CORS)
app.use(cors());
app.use(express.json());

// Định tuyến nạp toàn bộ thư mục tĩnh Frontend
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// CONFIG & CONNECT DATABASE (MONGODB)
// ==========================================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/web_msg_spa';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('🍃 KẾT NỐI DATABASE MONGODB THÀNH CÔNG!'))
    .catch(err => console.error('❌ LỖI KẾT NỐI DATABASE MONGODB:', err));

// ==========================================
// DEFINE SCHEMAS & MODELS
// ==========================================
const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=600' },
    date: { type: String, default: () => new Date().toLocaleDateString('vi-VN') }
});

const News = mongoose.model('News', NewsSchema);

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. API LẤY DANH SÁCH BÀI VIẾT
app.get('/api/news', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        
        if (limit === 999) {
            const allNews = await News.find({}).sort({ _id: -1 });
            return res.json({ data: allNews });
        }

        const startIndex = (page - 1) * limit;
        const totalItems = await News.countDocuments();
        const dbNews = await News.find({})
            .sort({ _id: -1 })
            .skip(startIndex)
            .limit(limit);

        res.json({
            totalItems: totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
            data: dbNews
        });
    } catch (error) {
        console.error("❌ LỖI API LẤY TIN TỨC:", error);
        res.status(500).json({ error: "Lỗi hệ thống Database." });
    }
});

// 2. API ĐĂNG BÀI VIẾT MỚI
app.post('/api/news', async (req, res) => {
    try {
        const { title, summary, content, image } = req.body;
        if (!title || !summary || !content) {
            return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin!" });
        }

        const newPost = new News({
            title: title.trim(),
            summary: summary.trim(),
            content: content.trim(),
            image: image.trim() || undefined
        });

        const savedPost = await newPost.save();
        res.status(201).json({ message: "Đăng bài thành công!", data: savedPost });
    } catch (error) {
        res.status(500).json({ error: "Không thể lưu bài viết." });
    }
});

// 3. API LẤY CHI TIẾT 1 BÀI VIẾT
app.get('/api/news/:id', async (req, res) => {
    try {
        const article = await News.findById(req.params.id);
        if (!article) return res.status(404).json({ error: "Không tìm thấy bài!" });
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: "Mã bài viết không hợp lệ." });
    }
});

// Cấu hình dự phòng (Fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// [BẮT BUỘC CHO VERCEL]
module.exports = app;

// Khởi chạy khi dùng ở Local
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 SERVER ĐANG CHẠY: http://localhost:${PORT}`);
    });
}