// Version: 1.0.2 - Force Rebuild
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({ silent: true });

const app = express();
app.use(cors());
app.use(express.json());

// Phục vụ file tĩnh
app.use(express.static(path.join(process.cwd(), 'public')));

const MONGODB_URI = process.env.MONGODB_URI;

// Model
const News = mongoose.models.News || mongoose.model('News', new mongoose.Schema({
    title: String,
    summary: String,
    content: String,
    image: { type: String, default: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=600' },
    date: { type: String, default: () => new Date().toLocaleDateString('vi-VN') }
}));

// API GET
app.get('/api/news', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) await mongoose.connect(MONGODB_URI);
        const data = await News.find().sort({ _id: -1 });
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: "Lỗi kết nối DB" });
    }
});

// API POST
app.post('/api/news', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) await mongoose.connect(MONGODB_URI);
        const { title, summary, content, image } = req.body;
        const newPost = new News({ title, summary, content, image: image || undefined });
        await newPost.save();
        res.status(201).json({ message: "Đăng bài thành công!" });
    } catch (error) {
        res.status(500).json({ error: "Không thể lưu bài viết" });
    }
});

// Routes điều hướng
app.get('/admin', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'admin.html')));
app.get('*', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'index.html')));

module.exports = app;