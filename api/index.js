const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/api/news', (req, res) => {
    try {
        const dataPath = path.join(process.cwd(), 'data.json');
        const allNews = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

        // Lấy tham số từ URL (mặc định trang 1, mỗi trang 6 bài)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {
            total: allNews.length,
            totalPages: Math.ceil(allNews.length / limit),
            currentPage: page,
            data: allNews.slice(startIndex, endIndex) // Cắt mảng dữ liệu theo trang
        };

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "Lỗi đọc dữ liệu" });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

module.exports = app;