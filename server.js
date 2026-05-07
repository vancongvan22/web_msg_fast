const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

// Tự động cấu hình đọc file .env
require('dotenv').config({ silent: true });

const app = express();

// 1. Middlewares
app.use(cors());
app.use(express.json());

// 2. Phục vụ file tĩnh (CSS, JS, Images)
app.use(express.static(path.join(process.cwd(), 'public')));

// 3. Kết nối MongoDB (Tối ưu kết nối cho Vercel Serverless)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/web_msg_spa';

// Biến kiểm tra kết nối để tránh kết nối lại nhiều lần
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log('🍃 MongoDB Connected');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
    }
};

// Gọi kết nối ngay khi khởi chạy
connectDB();

// 4. Định nghĩa Schema & Model
const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=600' },
    date: { type: String, default: () => new Date().toLocaleDateString('vi-VN') }
});

// Kiểm tra nếu model đã tồn tại thì dùng lại, tránh lỗi OverwriteModelError trên Vercel
const News = mongoose.models.News || mongoose.model('News', NewsSchema);

// 5. API ENDPOINTS

// GET: Lấy danh sách tin tức
app.get('/api/news', async (req, res) => {
    await connectDB(); // Đảm bảo luôn có kết nối
    try {
        const data = await News.find().sort({ _id: -1 });
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ error: "Không thể lấy dữ liệu từ Server." });
    }
});

// POST: Đăng bài mới
app.post('/api/news', async (req, res) => {
    await connectDB();
    try {
        const { title, summary, content, image } = req.body;
        if (!title || !summary || !content) {
            return res.status(400).json({ error: "Vui lòng nhập đủ thông tin bắt buộc!" });
        }
        const newPost = new News({
            title: title.trim(),
            summary: summary.trim(),
            content: content.trim(),
            image: image ? image.trim() : undefined
        });
        const savedPost = await newPost.save();
        res.status(201).json({ message: "Đăng bài thành công!", data: savedPost });
    } catch (error) {
        console.error("Lỗi POST API:", error);
        res.status(500).json({ error: "Lỗi hệ thống, không thể lưu bài viết." });
    }
});

// GET: Lấy chi tiết 1 bài
app.get('/api/news/:id', async (req, res) => {
    await connectDB();
    try {
        const article = await News.findById(req.params.id);
        if (!article) return res.status(404).json({ error: "Bài viết không tồn tại." });
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ error: "ID bài viết không hợp lệ." });
    }
});

// 6. ĐIỀU HƯỚNG TRANG (Fallback)
// Route cho trang admin
app.get('/admin', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'public', 'admin.html'));
});

// Tất cả các route khác trả về index.html
app.get('*', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'public', 'index.html'));
});

// 7. Xuất bản app cho Vercel
module.exports = app;

// Chạy Local
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server Local: http://localhost:${PORT}`));
}