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
        const response = await fetch('/api/news?limit=999');
        if (!response.ok) throw new Error('Không thể kết nối đến API Backend');
        
        const result = await response.json();
        const newsArray = Array.isArray(result) ? result : (result.data || []);
        
        const item = newsArray.find(article => article.id == id);

        if (item) {
            container.innerHTML = `
                <img src="${item.image}" class="w-full h-[45vh] object-cover">
                <div class="p-6 md:p-8 -mt-6 bg-white rounded-t-[32px] relative z-10 shadow-sm">
                    <div class="flex items-center gap-2 text-slate-400 text-xs mb-4">
                        <i data-lucide="clock" class="w-4 h-4"></i> ${item.date}
                    </div>
                    <h1 class="text-2xl md:text-3xl font-black text-slate-900 mb-6">${item.title}</h1>
                    <div class="prose text-slate-600 leading-relaxed">${item.content || item.summary}</div>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        } else {
            container.innerHTML = '<p class="text-center py-20 text-slate-500 font-medium">Không tìm thấy bài viết này trong hệ thống!</p>';
        }
    } catch (error) {
        console.error("Lỗi Frontend:", error);
        container.innerHTML = '<p class="text-center py-20 text-red-500 font-semibold">Lỗi kết nối hệ thống.</p>';
    }
}

document.addEventListener('DOMContentLoaded', initTrangChiTiet);