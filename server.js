const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config({ silent: true });

const app = express();

app.use(cors());
app.use(express.json());

// [SỬA QUAN TRỌNG] Đảm bảo trỏ đúng thư mục public trên Vercel
const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath));

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

// --- API ENDPOINTS ---
app.get('/api/news', async (req, res) => {
    await connectDB();
    try {
        const data = await News.find().sort({ _id: -1 });
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy dữ liệu" });
    }
});

app.post('/api/news', async (req, res) => {
    await connectDB();
    try {
        const { title, summary, content, image } = req.body;
        if (!title || !summary || !content) return res.status(400).json({ error: "Thiếu thông tin!" });
        const newPost = new News({ title, summary, content, image });
        await newPost.save();
        res.status(201).json({ message: "Đăng thành công!", data: newPost });
    } catch (error) {
        res.status(500).json({ error: "Lỗi lưu bài viết" });
    }
});

const News = mongoose.models.News || mongoose.model('News', new mongoose.Schema({
    title: String, summary: String, content: String, image: String,
    date: { type: String, default: () => new Date().toLocaleDateString('vi-VN') }
}));

// --- ĐIỀU HƯỚNG TRANG ---
app.get('/admin', (req, res) => res.sendFile(path.join(publicPath, 'admin.html')));
app.get('/detail/:id', (req, res) => res.sendFile(path.join(publicPath, 'detail.html')));
app.get('*', (req, res) => res.sendFile(path.join(publicPath, 'index.html')));

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log('🚀 http://localhost:3000'));
}