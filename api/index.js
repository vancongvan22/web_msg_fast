// api/index.js
const express = require('express');
const path = require('path');
const { getNewsData } = require(path.join(process.cwd(), 'lib', 'data-helpers'));

const app = express();
app.use(express.json());

app.get('/api/news', (req, res) => {
    try {
        const allNews = getNewsData();
        
        if (!Array.isArray(allNews)) {
            return res.json({ total: 0, totalPages: 0, currentPage: 1, data: [] });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        res.json({
            total: allNews.length,
            totalPages: Math.ceil(allNews.length / limit),
            currentPage: page,
            data: allNews.slice(startIndex, endIndex)
        });
    } catch (error) {
        console.error("Lỗi hệ thống Backend:", error.message);
        res.status(500).json({ error: "Lỗi xử lý nội bộ tại server" });
    }
});

module.exports = app;