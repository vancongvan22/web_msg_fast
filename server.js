// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');

// Tự động cấu hình đọc file .env nếu có (giúp linh hoạt chọn PORT khi deploy)
require('dotenv').config({ silent: true });

const app = express();
// Ưu tiên PORT của hệ thống hosting cấp, nếu không có mới dùng PORT trong .env hoặc mặc định 3000
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Định tuyến nạp toàn bộ thư mục tĩnh Frontend (public/)
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// MOCK DATA - Dữ liệu giả lập danh sách tin tức
// ==========================================
const mockNews = [
    {
        id: 1,
        title: "Liệu pháp massage ấn huyệt đẩy lùi đau vai gáy hiệu quả",
        summary: "Đau vai gáy là căn bệnh phổ biến của dân văn phòng. Tìm hiểu phương pháp ấn huyệt y học cổ truyền giúp dứt điểm cơn đau nhanh chóng.",
        content: "Đau vai gáy không chỉ gây mệt mỏi mà còn ảnh hưởng lớn đến năng suất làm việc. Tại WEB_MSG, liệu pháp ấn huyệt chuyên sâu kết hợp thảo dược độc quyền giúp đả thông kinh lạc, tăng cường tuần hoàn máu vùng cổ. Khách hàng sẽ cảm nhận rõ sự nhẹ nhõm ngay từ buổi trị liệu đầu tiên.",
        image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=600",
        date: "05/05/2026"
    },
    {
        id: 2,
        title: "Ưu đãi tri ân: Giảm ngay 30% cho gói trị liệu đá nóng",
        summary: "Chào hè rực rỡ, WEB_MSG mang đến chương trình khuyến mãi lớn nhất năm dành cho dịch vụ massage đá nóng phục hồi năng lượng.",
        content: "Nhằm tri ân khách hàng thân thiết, từ ngày mai hệ thống áp dụng ưu đãi giảm 30% cho toàn bộ liệu trình đá nóng Volcano phục hồi sâu. Sức nóng từ đá nham thạch tự nhiên kết hợp tinh dầu oải hương sẽ giúp bạn đánh bay căng thẳng, ngủ ngon sâu giấc.",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600",
        date: "04/05/2026"
    },
    {
        id: 3,
        title: "Tác dụng bất ngờ của massage thảo dược đối với giấc ngủ",
        summary: "Bạn thường xuyên bị mất ngủ, ngủ không sâu giấc? Hãy khám phá sức mạnh chữa lành của các túi thảo dược thiên nhiên hấp nóng.",
        content: "Mất ngủ kéo dài là tác nhân tàn phá nhan sắc và sức khỏe. Massage túi thảo dược tại spa sử dụng các loại cây thuốc nam quý như ngải cứu, gừng gió, đinh lăng được hấp chín bằng hơi nước, giúp kích thích các huyệt vị, mang lại trạng thái thư giãn tuyệt đối cho hệ thần kinh.",
        image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=600",
        date: "01/05/2026"
    }
];

// ==========================================
// API ENDPOINTS - Hệ thống API cung cấp dữ liệu
// ==========================================

// API lấy danh sách bài viết (Có hỗ trợ phân trang)
app.get('/api/news', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    
    // Nếu yêu cầu lấy toàn bộ dữ liệu (như trang chi tiết cần tìm kiếm)
    if (limit === 999) {
        return res.json({ data: mockNews });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {
        totalItems: mockNews.length,
        totalPages: Math.ceil(mockNews.length / limit),
        currentPage: page,
        data: mockNews.slice(startIndex, endIndex)
    };

    res.json(results);
});

// Cấu hình dự phòng (Fallback): Mọi đường dẫn không khớp API sẽ tự trả về index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Khởi chạy hệ thống máy chủ
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 SERVER CHẠY THÀNH CÔNG TRÊN PRODUCTION!`);
    console.log(`🌍 Địa chỉ truy cập tại: http://localhost:${PORT}`);
    console.log(`==================================================`);
});