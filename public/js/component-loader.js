// public/js/component-loader.js

/**
 * Hàm tự động tìm các thẻ có thuộc tính data-component và nạp file html tương ứng
 */
async function loadComponents() {
    const elements = document.querySelectorAll('[data-component]');
    
    const promises = Array.from(elements).map(async (el) => {
        const componentName = el.getAttribute('data-component');
        try {
            const response = await fetch(`/components/${componentName}.html`);
            if (!response.ok) throw new Error(`Không thể tải component: ${componentName}`);
            
            const htmlContent = await response.text();
            el.innerHTML = htmlContent;
        } catch (error) {
            console.error(`[Component Error]`, error);
            el.innerHTML = `<div class="text-red-500 p-2 text-xs">Lỗi nạp khối ${componentName}</div>`;
        }
    });

    // Chờ tất cả component nạp xong xuôi
    await Promise.all(promises);

    // ==========================================
    // VỊ TRÍ SỬA BỔ SUNG: Tự động gọi chèn nút Zalo/Phone nổi ngay khi HTML dùng chung vừa nạp xong
    // ==========================================
    injectFloatingContactButtons();

    // Kích hoạt thư viện Icon Lucide trên toàn trang sau khi giao diện sẵn sàng
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * VỊ TRÍ THÊM MỚI: Hàm dựng cụm nút liên hệ nổi an toàn tuyệt đối bằng DOM tạo phần tử trực tiếp.
 * Đảm bảo cô lập logic, không bao giờ gây lỗi cú pháp chuỗi làm chết Navigation Bar.
 */
function injectFloatingContactButtons() {
    // Nếu cụm nút này đã tồn tại trên trang thì dừng lại để tránh trùng lặp
    if (document.getElementById('floating-contact-group')) return;

    // 1. Tạo khung chứa bao quanh (Container) đặt ở góc phải bên dưới
    const container = document.createElement('div');
    container.id = 'floating-contact-group';
    container.className = 'fixed bottom-28 right-6 z-40 flex flex-col gap-4 items-end md:bottom-10';

    // 2. Tạo nút liên hệ Zalo sử dụng logo dạng ảnh CDN chính thức
    const zaloBtn = document.createElement('a');
    zaloBtn.href = 'https://zalo.me/your_phone_number'; // Thay số điện thoại Zalo của bạn tại đây
    zaloBtn.target = '_blank';
    zaloBtn.title = 'Chat Zalo';
    zaloBtn.className = 'flex items-center justify-center w-14 h-14 bg-[#0068ff] rounded-full shadow-[0_4px_14px_rgba(0,104,255,0.4)] hover:bg-[#0056d6] transition-all transform hover:-translate-y-1 hover:scale-105 duration-200';

    const zaloImg = document.createElement('img');
    zaloImg.src = 'https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg';
    zaloImg.alt = 'Zalo';
    zaloImg.className = 'w-8 h-8 object-contain';
    zaloBtn.appendChild(zaloImg);

    // 3. Tạo nút Gọi điện thoại kèm hiệu ứng sóng nhấp nháy thu hút khách
    const phoneBtn = document.createElement('a');
    phoneBtn.href = 'tel:0123456789'; // Thay số điện thoại gọi trực tiếp của bạn tại đây
    phoneBtn.title = 'Gọi ngay';
    phoneBtn.className = 'relative flex items-center justify-center w-14 h-14 bg-teal-600 text-white rounded-full shadow-[0_4px_14px_rgba(13,148,136,0.4)] hover:bg-teal-700 transition-all transform hover:-translate-y-1 hover:scale-105 duration-200';

    const pulseSpan = document.createElement('span');
    pulseSpan.className = 'animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75';
    phoneBtn.appendChild(pulseSpan);

    const phoneIcon = document.createElement('i');
    phoneIcon.setAttribute('data-lucide', 'phone');
    phoneIcon.className = 'w-7 h-7 relative z-10';
    phoneBtn.appendChild(phoneIcon);

    // 4. Lắp ráp các nút vào container và đính vào cuối body trang web
    container.appendChild(zaloBtn);
    container.appendChild(phoneBtn);
    document.body.appendChild(container);
}

/**
 * Khai báo hàm xử lý đóng mở menu điện thoại ở phạm vi toàn cục (window)
 * Giúp giải quyết triệt để lỗi "toggleMobileMenu is not defined"
 */
window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    
    if (!menu || !icon) return;

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        if (typeof lucide !== 'undefined') {
            icon.setAttribute('data-lucide', 'x'); // Chuyển đổi thành icon dấu X đóng menu
            lucide.createIcons();
        }
    } else {
        menu.classList.add('hidden');
        if (typeof lucide !== 'undefined') {
            icon.setAttribute('data-lucide', 'menu'); // Trả lại icon 3 gạch mở menu
            lucide.createIcons();
        }
    }
};

// Đăng ký kích hoạt tiến trình tải cấu phần
document.addEventListener('DOMContentLoaded', loadComponents);