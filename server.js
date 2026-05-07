const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({ silent: true });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

const MONGODB_URI = process.env.MONGODB_URI;

// Model định nghĩa sẵn để dùng chung
const News = mongoose.models.News || mongoose.model('News', new mongoose.Schema({
    title: String,
    summary: String,
    content: String,
    image: { type: String, default: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=600' },
    date: { type: String, default: () => new Date().toLocaleDateString('vi-VN') }
}));

// Hàm bổ trợ kết nối DB
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(MONGODB_URI);
};

// API POST - Nơi bạn đang bị lỗi
app.post('/api/news', async (req, res) => {
    try {
        await connectDB(); // Ép kết nối trước khi lưu
        const { title, summary, content, image } = req.body;
        
        if (!title || !summary || !content) {
            return res.status(400).json({ error: "Vui lòng nhập đủ các trường bắt buộc" });
        }

        const newPost = new News({ title, summary, content, image: image || undefined });
        await newPost.save();
        
        res.status(201).json({ message: "Đăng bài thành công!" });
    } catch (error) {
        console.error("Lỗi POST:", error);
        res.status(500).json({ error: "Lỗi kết nối Database" });
    }
});

// API GET
app.get('/api/news', async (req, res) => {
    try {
        await connectDB();
        const data = await News.find().sort({ _id: -1 });
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: "Lỗi Server" });
    }
});

// Điều hướng file tĩnh
app.get('/admin', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'admin.html')));
app.get('*', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'index.html')));

module.exports = app;