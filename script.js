// دالة شاملة لضمان عمل السكريبت على جميع المتصفحات والأجهزة
(function() {
    const initTheme = () => {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const body = document.body;

        if (!darkModeToggle) return;

        // 1. جلب التفضيل المحفوظ
        const currentTheme = localStorage.getItem('theme');
        
        // 2. تطبيق الوضع المحفوظ فوراً
        if (currentTheme === 'dark') {
            body.classList.add('dark-theme');
            darkModeToggle.textContent = '☀️ الوضع النهاري';
        }

        // 3. مستمع الحدث للضغط
        darkModeToggle.onclick = () => {
            body.classList.toggle('dark-theme');
            
            let theme = 'light';
            if (body.classList.contains('dark-theme')) {
                theme = 'dark';
                darkModeToggle.textContent = '☀️ الوضع النهاري';
            } else {
                darkModeToggle.textContent = '🌙 الوضع الليلي';
            }
            
            // حفظ الاختيار في ذاكرة المتصفح
            localStorage.setItem('theme', theme);
        };
    };

    // تشغيل الدالة عند تحميل الصفحة أو التنقل
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();

// --- دالة البحث والفلترة ---
function filterDoctors() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const specialtyFilter = document.getElementById('specialtyFilter').value;
    const cards = document.getElementsByClassName('doctor-card');

    for (let i = 0; i < cards.length; i++) {
        const name = cards[i].getAttribute('data-name').toLowerCase();
        const specialty = cards[i].getAttribute('data-specialty');
        
        const matchesSearch = name.includes(searchInput);
        const matchesSpecialty = (specialtyFilter === 'all' || specialty === specialtyFilter);

        cards[i].style.display = (matchesSearch && matchesSpecialty) ? "block" : "none";
    }
}

// --- دالة نسخ الإيميل ---
function copyEmail(email) {
    navigator.clipboard.writeText(email).then(() => {
        alert("تم نسخ الإيميل: " + email);
    });
}

// --- دالة نسخ البيانات الكاملة ---
function copyFullInfo(name, major, office, email) {
    const fullText = `دليل دكاترة الهندسة:\nالاسم: ${name}\nالتخصص: ${major}\nالمكتب: ${office}\nالإيميل: ${email}`;
    navigator.clipboard.writeText(fullText).then(() => {
        alert("تم نسخ جميع بيانات " + name + " بنجاح!");
    });
}