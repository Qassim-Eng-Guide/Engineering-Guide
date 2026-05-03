// 1. تعريف المتغيرات الأساسية
const body = document.body;
const darkModeToggle = document.getElementById('darkModeToggle');
const langToggle = document.getElementById('langToggle');
let currentLang = 'ar';

// 2. فحص التفضيل المحفوظ للوضع الليلي
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    updateDarkModeButton(true);
}

// 3. وظائف القائمة (الترس)
function toggleMenu() {
    const menu = document.querySelector('.settings-menu');
    menu.classList.toggle('active');
}

// إغلاق القائمة عند الضغط خارجها
document.addEventListener('click', function(event) {
    const menu = document.querySelector('.settings-menu');
    if (menu && !menu.contains(event.target) && menu.classList.contains('active')) {
        menu.classList.remove('active');
    }
});

// 4. تبديل الوضع الليلي
if (darkModeToggle) {
    darkModeToggle.onclick = function(e) {
        e.stopPropagation(); // منع إغلاق القائمة فور الضغط
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateDarkModeButton(isDark);
    };
}

function updateDarkModeButton(isDark) {
    if (darkModeToggle) {
        darkModeToggle.textContent = isDark ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي';
    }
}

// 5. نظام الترجمة الشامل
const translations = {
    ar: {
        title: "كلية الهندسة",
        subtitle: "جامعة القصيم",
        disclaimer: "هذا الموقع مبادرة طلابية لتسهيل التواصل مع الدكتور وليس جهة رسمية تابعة للكلية.",
        guideTitle: "دليل الرموز :",
        searchPlholder: "ابحث باسم الدكتور...",
        langBtn: "🌐 English",
        noResults: "⚠️ عذراً، لا يوجد دكتور بهذا الاسم - تواصل معنا لإضافته."
    },
    en: {
        title: "College of Engineering",
        subtitle: "Qassim University",
        disclaimer: "Student initiative to facilitate communication, not an official faculty entity.",
        guideTitle: "Office Guide:",
        searchPlholder: "Search by doctor name...",
        langBtn: "🌐 العربية",
        noResults: "⚠️ Sorry, no doctor found with this name - Contact us to add it."
    }
};

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    
    // أ. تحديث النصوص الثابتة
    document.querySelector('.header h1').innerText = translations[currentLang].title;
    document.querySelector('.header p:nth-of-type(1)').innerText = translations[currentLang].subtitle;
    document.querySelector('.disclaimer').innerText = translations[currentLang].disclaimer;
    document.querySelector('.office-guide h3').innerText = translations[currentLang].guideTitle;
    document.getElementById('searchInput').placeholder = translations[currentLang].searchPlholder;
    document.getElementById('langToggle').innerText = translations[currentLang].langBtn;

    // ب. ترجمة العناصر التي تحمل كلاس translate
    document.querySelectorAll('.translate').forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text) el.innerText = text;
    });

    // ج. تغيير اتجاه الموقع وتنسيقه
    body.style.direction = currentLang === 'ar' ? 'rtl' : 'ltr';
    currentLang === 'en' ? body.classList.add('en-mode') : body.classList.remove('en-mode');
    
    // د. ترجمة أسماء الدكاترة (إذا كانت البيانات موجودة)
    document.querySelectorAll('.doctor-card').forEach(card => {
        const nameAr = card.getAttribute('data-name');
        const nameEn = card.getAttribute('data-name-en');
        const nameEl = card.querySelector('h2');
        if (nameEl && nameEn) {
            nameEl.innerText = currentLang === 'ar' ? nameAr : nameEn;
        }
    });

    filterDoctors();
}

// 6. دالة البحث والفلترة
function filterDoctors() {
    var searchInput = document.getElementById('searchInput').value.toLowerCase();
    var specialtyFilter = document.getElementById('specialtyFilter').value;
    var cards = document.getElementsByClassName('doctor-card');
    var doctorList = document.querySelector('.doctor-list');
    var visibleCount = 0;

    var existingMsg = document.querySelector('.no-results-msg');
    if (existingMsg) existingMsg.remove();

    for (var i = 0; i < cards.length; i++) {
        var specialty = cards[i].getAttribute('data-specialty') || "";
        var nameAr = (cards[i].getAttribute('data-name') || "").toLowerCase();
        var nameEn = (cards[i].getAttribute('data-name-en') || "").toLowerCase();
        
        var matchesSpecialty = (specialtyFilter === 'all' || specialty === specialtyFilter);
        var matchesSearch = nameAr.includes(searchInput) || nameEn.includes(searchInput);

        if (matchesSearch && matchesSpecialty) {
            cards[i].style.display = "block";
            visibleCount++;
        } else {
            cards[i].style.display = "none";
        }
    }

    if (visibleCount === 0 && doctorList) {
        var msg = document.createElement('div');
        msg.className = 'no-results-msg';
        msg.innerHTML = translations[currentLang].noResults;
        doctorList.appendChild(msg);
    }
}

// 7. شريط التقدم والتحميل
window.addEventListener('scroll', function() {
    var winScroll = body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    var scrollProgress = document.getElementById("scroll-progress");
    if (scrollProgress) scrollProgress.style.width = scrolled + "%";
});

window.addEventListener('load', function() {
    const loader = document.getElementById('loader-wrapper');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 600);
    }
});

// 8. وظائف النسخ
function copyEmail(email) {
    navigator.clipboard.writeText(email).then(() => {
        alert(currentLang === 'ar' ? "تم نسخ الإيميل: " + email : "Email Copied: " + email);
    });
}
function copyFullInfo(name, major, office, email) {
    // إضافة الجملة الافتتاحية كما كانت سابقاً
    const header = currentLang === 'ar' ? "معلومات التواصل مع الدكتور:" : "Doctor Contact Information:";
    
    // تجهيز النص الكامل بالترتيب المطلوب
    const fullText = `${header}\nالاسم: ${name}\nالتخصص: ${major}\nالمكتب: ${office}\nالإيميل: ${email}`;
    
    // تنفيذ عملية النسخ
    navigator.clipboard.writeText(fullText).then(() => {
        const alertMsg = currentLang === 'ar' ? "تم نسخ البيانات بنجاح!" : "Info Copied Successfully!";
        alert(alertMsg);
    }).catch(err => {
        alert("حدث خطأ في النسخ، تأكد من تحديث الصفحة.");
    });
}