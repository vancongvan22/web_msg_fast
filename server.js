const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config({ silent: true });

const app = express();

// 1. Middlewares
app.use(cors());
app.use(express.json());

// 2. CẤU HÌNH ĐƯỜNG DẪN TĨNH (Sửa lỗi 404 cho CSS/JS/Images)
// Dùng path.join với process.cwd() để Vercel tìm đúng thư mục public
const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath));

// 3. KẾT NỐI MONGODB (Giữ nguyên logic của bạn)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/web_msg_spa';
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log('🍃 MongoDB Connected');
    } catch (err) {
        console.error('❌ MongoDB Error:', err);
    }
};
connectDB();

// 4. MODEL
const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=600' },
    date: { type: String, default: () => new Date().toLocaleDateString('vi-VN') }
});
const News = mongoose.models.News || mongoose.model('News', NewsSchema);

// 5. API ENDPOINTS
app.get('/api/news', async (req, res) => {
    await connectDB();
    try {
        const data = await News.find().sort({ _id: -1 });
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy dữ liệu" });
    }
});

app.post('/api/news', async (req, res) => {
    await connectDB();
    try {
        const { title, summary, content, image } = req.body;
        if (!title || !summary || !content) return res.status(400).json({ error: "Thiếu thông tin!" });
        const newPost = new News({ title: title.trim(), summary: summary.trim(), content: content.trim(), image: image?.trim() });
        await newPost.save();
        res.status(201).json({ message: "Đăng thành công!", data: newPost });
    } catch (error) {
        res.status(500).json({ error: "Lỗi lưu Database" });
    }
});

app.get('/api/news/:id', async (req, res) => {
    await connectDB();
    try {
        const article = await News.findById(req.params.id);
        if (!article) return res.status(404).json({ error: "Không tìm thấy bài" });
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ error: "ID không hợp lệ" });
    }
});

// 6. ĐIỀU HƯỚNG TRANG (Sửa quan trọng nhất)
// Khi dùng Vercel, nên phục vụ file bằng path.join(publicPath, 'file_name')
app.get('/admin', (req, res) => {
    res.sendFile(path.join(publicPath, 'admin.html'));
});

// Trang chi tiết bài viết
app.get('/detail/:id', (req, res) => {
    res.sendFile(path.join(publicPath, 'detail.html'));
});

// Trang chủ và các trang khác
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
}