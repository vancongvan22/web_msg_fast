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
        const response = await fetch(`/api/news/${id}`);
        
        if (!response.ok) {
            container.innerHTML = '<div class="text-center py-40 text-slate-500 font-medium">Không tìm thấy bài viết này trong hệ thống hoặc đường link đã hết hạn!</div>';
            return;
        }
        
        const item = await response.json();

        // Đổ dữ liệu thật vào cấu hình giao diện
        container.innerHTML = `
            <div class="relative w-full h-[45vh] overflow-hidden rounded-xl mb-6 shadow-inner">
                <img src="${item.image}" class="w-full h-full object-cover" alt="${item.title}">
            </div>
            <div class="p-2 relative z-10">
                <div class="flex items-center gap-2 text-slate-400 text-xs mb-4">
                    <i data-lucide="clock" class="w-4 h-4"></i> Đăng ngày: ${item.date}
                </div>
                <h1 class="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-tight">${item.title}</h1>
                
                <p class="text-slate-500 font-medium italic border-l-4 border-teal-800 pl-3 py-1 bg-slate-50 rounded-r-lg mb-6 text-sm md:text-base">
                    ${item.summary || ''}
                </p>

                <div class="prose max-w-none text-slate-600 leading-relaxed space-y-4 text-base md:text-lg">
                    ${formatContent(item.content)}
                </div>
            </div>
        `;
        
        document.title = item.title + " | WEB_MSG";
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (error) {
        console.error("Lỗi giao diện chi tiết:", error);
        container.innerHTML = '<div class="text-center py-40 text-red-500 font-semibold">Lỗi kết nối hệ thống. Vui lòng thử lại sau!</div>';
    }
}

function formatContent(text) {
    if (!text) return '';
    return text.split('\n').map(p => p.trim() ? `<p class="mb-4">${p}</p>` : '').join('');
}

document.addEventListener('DOMContentLoaded', initTrangChiTiet);