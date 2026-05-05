// lib/data-helpers.js
const fs = require('fs');
const path = require('path');

function getNewsData() {
    try {
        const filePath = path.join(process.cwd(), 'data.json');
        const rawData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Lỗi khi đọc file data.json:", error.message);
        return [];
    }
}

module.exports = { getNewsData };