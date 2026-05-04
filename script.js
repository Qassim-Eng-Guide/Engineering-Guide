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
    // إذا كنت جالس تسحب، لا تفتح القائمة
    if (isDragging) return;
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
        e.stopPropagation(); 
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
    
    document.querySelector('.header h1').innerText = translations[currentLang].title;
    document.querySelector('.header p:nth-of-type(1)').innerText = translations[currentLang].subtitle;
    document.querySelector('.disclaimer').innerText = translations[currentLang].disclaimer;
    document.querySelector('.office-guide h3').innerText = translations[currentLang].guideTitle;
    document.getElementById('searchInput').placeholder = translations[currentLang].searchPlholder;
    document.getElementById('langToggle').innerText = translations[currentLang].langBtn;

    document.querySelectorAll('.translate').forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text) el.innerText = text;
    });

    body.style.direction = currentLang === 'ar' ? 'rtl' : 'ltr';
    currentLang === 'en' ? body.classList.add('en-mode') : body.classList.remove('en-mode');
    
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
function copyFullInfo(name, major, office, email) {
    const header = currentLang === 'ar' ? "معلومات التواصل مع الدكتور:" : "Doctor Contact Information:";
    const fullText = `${header}\nالاسم: ${name}\nالتخصص: ${major}\nالمكتب: ${office}\nالإيميل: ${email}`;
    
    navigator.clipboard.writeText(fullText).then(() => {
        const alertMsg = currentLang === 'ar' ? "تم نسخ البيانات بنجاح!" : "Info Copied Successfully!";
        alert(alertMsg);
    }).catch(err => {
        alert("حدث خطأ في النسخ.");
    });
}

// --- 9. منطق سحب وتحريك الترس (النسخة المتوافقة مع جميع المتصفحات) ---
const menuContainer = document.querySelector('.settings-menu');
const gearIcon = document.getElementById('mainGear');
let isDragging = false;
let currentX, currentY, initialX, initialY;
let xOffset = 0, yOffset = 0;

// إضافة مستمعات الأحداث للماوس واللمس مع خاصية passive: false لدعم المتصفحات الحديثة
menuContainer.addEventListener("touchstart", dragStart, { passive: false });
menuContainer.addEventListener("touchend", dragEnd, { passive: false });
menuContainer.addEventListener("touchmove", drag, { passive: false });

menuContainer.addEventListener("mousedown", dragStart, false);
document.addEventListener("mouseup", dragEnd, false); // الأفضل يكون المستمع على الوثيقة كاملة
document.addEventListener("mousemove", drag, false);

function dragStart(e) {
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }

    // التحقق أن الضغط تم على الأيقونة أو الحاوية وليس الأزرار الداخلية
    if (e.target.id === "mainGear" || e.target.classList.contains('floating-gear')) {
        isDragging = true;
    }
}

function dragEnd(e) {
    if (isDragging) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
}

function drag(e) {
    if (isDragging) {
        // منع التمرير الافتراضي للمتصفح أثناء السحب (حل مشكلة السفاري والايفون)
        e.preventDefault(); 
        
        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;
        
        // استخدام translate3d لأداء أفضل في معالجة الجرافيك بالمتصفح
        menuContainer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    }
}