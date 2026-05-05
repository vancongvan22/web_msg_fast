// public/js/detail.js

async function initTrangChiTiet() {
    const container = document.getElementById('main-content');
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id'); 

    if (!id) {
        window.location.href = '/';
        return;
    }

    try {
        // Gửi request lên Backend
        const response = await fetch('/api/news?limit=999');
        if (!response.ok) throw new Error('Không thể kết nối đến máy chủ API');
        
        const result = await response.json();
        const newsArray = Array.isArray(result) ? result : (result.data || []);
        
        // Tìm kiếm bài viết theo ID
        const item = newsArray.find(article => article.id == id);

        if (item) {
            // Đổ dữ liệu vào container chính, giữ nguyên cấu trúc bo góc lượn sóng đè lên ảnh như thiết kế cũ
            container.innerHTML = `
                <div class="relative w-full h-[45vh] overflow-hidden">
                    <img src="${item.image}" class="w-full h-full object-cover" alt="${item.title}">
                </div>
                <div class="p-6 md:p-8 -mt-8 bg-white rounded-t-[32px] relative z-10 shadow-sm">
                    <div class="flex items-center gap-2 text-slate-400 text-xs mb-4">
                        <i data-lucide="clock" class="w-4 h-4"></i> ${item.date}
                    </div>
                    <h1 class="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-tight">${item.title}</h1>
                    <div class="prose max-w-none text-slate-600 leading-relaxed space-y-4">
                        ${formatContent(item.content || item.summary)}
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = '<div class="text-center py-40 text-slate-500 font-medium">Không tìm thấy bài viết này trong hệ thống!</div>';
        }
        
        // Kích hoạt toàn bộ icon Lucide (bao gồm cả icon ở Header và Fixed Bottom)
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (error) {
        console.error("Lỗi giao diện chi tiết:", error);
        container.innerHTML = '<div class="text-center py-40 text-red-500 font-semibold">Lỗi kết nối hệ thống. Vui lòng thử lại sau!</div>';
    }
}

// Hàm bổ trợ tự động xuống dòng cho nội dung bài viết nếu là chuỗi thuần túy
function formatContent(text) {
    if (!text) return '';
    return text.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('');
}

document.addEventListener('DOMContentLoaded', initTrangChiTiet);