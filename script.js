// التأكد من تحميل الصفحة بالكامل قبل تشغيل الكود
document.addEventListener('DOMContentLoaded', () => {
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // 1. التحقق من التفضيل المحفوظ سابقاً
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-theme');
        if(darkModeToggle) darkModeToggle.textContent = '☀️ الوضع النهاري';
    }

    // 2. برمجة زر التبديل
    if(darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            let theme = 'light';
            if (body.classList.contains('dark-theme')) {
                theme = 'dark';
                darkModeToggle.textContent = '☀️ الوضع النهاري';
            } else {
                darkModeToggle.textContent = '🌙 الوضع الليلي';
            }
            localStorage.setItem('theme', theme);
        });
    }
});

// --- دالة البحث والفلترة (تبقى خارج المستمع لكي تعمل من HTML) ---
function filterDoctors() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const specialtyFilter = document.getElementById('specialtyFilter').value;
    const cards = document.getElementsByClassName('doctor-card');

    for (let i = 0; i < cards.length; i++) {
        const name = cards[i].getAttribute('data-name').toLowerCase();
        const specialty = cards[i].getAttribute('data-specialty');
        
        const matchesSearch = name.includes(searchInput);
        const matchesSpecialty = (specialtyFilter === 'all' || specialty === specialtyFilter);

        if (matchesSearch && matchesSpecialty) {
            cards[i].style.display = "block";
        } else {
            cards[i].style.display = "none";
        }
    }
}
// --- دالة نسخ الإيميل ---
function copyEmail(email) {
    navigator.clipboard.writeText(email).then(() => {
        alert("تم نسخ الإيميل: " + email);
    }).catch(err => {
        console.error('فشل النسخ: ', err);
    });
}
// دالة نسخ البيانات الكاملة للدكتور
function copyFullInfo(name, major, office, email) {
    const fullText = `معلومات التواصل مع الدكتور:\nالاسم: ${name}\nالتخصص: ${major}\nالمكتب: ${office}\nالإيميل: ${email}`;
    
    navigator.clipboard.writeText(fullText).then(() => {
        alert("تم نسخ جميع بيانات " + name + " بنجاح!");
    }).catch(err => {
        console.error('فشل النسخ الكامل: ', err);
    });
}