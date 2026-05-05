const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// 1. Phục vụ file tĩnh (Quan trọng: Đưa lên đầu)
app.use(express.static(path.join(process.cwd(), 'public')));

// 2. API lấy tin tức
app.get('/api/news', (req, res) => {
    try {
        const dataPath = path.join(process.cwd(), 'data.json');
        const jsonData = fs.readFileSync(dataPath, 'utf-8');
        res.json(JSON.parse(jsonData));
    } catch (error) {
        res.status(500).send("Loi doc file");
    }
});

// 3. Trang chủ (Chỉ dùng đường dẫn chính xác '/')
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

module.exports = app;