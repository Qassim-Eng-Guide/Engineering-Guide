// دالة لتوحيد الحروف ومعالجة الهمزات والأخطاء الإملائية
function normalizeArabic(text) {
    if (!text) return "";
    return text
        .replace(/[أإآ]/g, "ا") // توحيد الألف
        .replace(/ة/g, "ه")    // التاء المربوطة
        .replace(/ى/g, "ي")    // الياء المتطرفة
        .replace(/[\u064B-\u0652]/g, "") // إزالة التشكيل إن وجد
        .trim();
}
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
    if (isDragging) return; // منع الفتح أثناء السحب
    menu.classList.toggle('active');
}

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
    var searchInputEl = document.getElementById('searchInput');
    if (!searchInputEl) return;
    
    // 1. تنظيف النص وتمريره عبر دالة توحيد الحروف (الهمزات)
    var rawInput = searchInputEl.value.toLowerCase().trim().replace(/\.$/, "");
    var searchInput = normalizeArabic(rawInput); 

    var specialtyFilter = document.getElementById('specialtyFilter').value;
    var cards = document.getElementsByClassName('doctor-card');
    var doctorList = document.querySelector('.doctor-list');
    var visibleCount = 0;

    var existingMsg = document.querySelector('.no-results-msg');
    if (existingMsg) existingMsg.remove();

    for (var i = 0; i < cards.length; i++) {
        var specialty = cards[i].getAttribute('data-specialty') || "";
        
        // 2. تطبيق توحيد الحروف على اسم الدكتور أيضاً لضمان المطابقة
        var nameArRaw = cards[i].getAttribute('data-name') || "";
        var nameAr = normalizeArabic(nameArRaw.toLowerCase());
        
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

// 7. شريط التقدم
window.addEventListener('scroll', function() {
    var winScroll = body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    var scrollProgress = document.getElementById("scroll-progress");
    if (scrollProgress) scrollProgress.style.width = scrolled + "%";
});

// 8. وظائف النسخ المعدلة
function copyEmail(email) {
    navigator.clipboard.writeText(email).then(() => {
        const msg = currentLang === 'ar' ? "تم نسخ الإيميل بنجاح!" : "Email Copied Successfully!";
        alert(msg + "\n" + email);
    }).catch(err => {
        alert("فشل النسخ، تأكد من إعدادات المتصفح.");
    });
}

function copyFullInfo(name, major, office, email) {
    const header = currentLang === 'ar' ? "معلومات التواصل مع الدكتور:" : "Doctor Contact Information:";
    const fullText = `${header}\nالاسم: ${name}\nالتخصص: ${major}\nالمكتب: ${office}\nالإيميل: ${email}`;
    
    navigator.clipboard.writeText(fullText).then(() => {
        const alertMsg = currentLang === 'ar' ? "تم نسخ جميع البيانات بنجاح!" : "All Data Copied Successfully!";
        alert(alertMsg);
    }).catch(err => {
        alert("حدث خطأ أثناء النسخ.");
    });
}

// 9. منطق سحب وتحريك الترس
const menuContainer = document.querySelector('.settings-menu');
let isDragging = false;
let currentX, currentY, initialX, initialY;
let xOffset = 0, yOffset = 0;

menuContainer.addEventListener("touchstart", dragStart, { passive: false });
menuContainer.addEventListener("touchend", dragEnd, { passive: false });
menuContainer.addEventListener("touchmove", drag, { passive: false });
menuContainer.addEventListener("mousedown", dragStart, false);
document.addEventListener("mouseup", dragEnd, false);
document.addEventListener("mousemove", drag, false);

function dragStart(e) {
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }
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
        menuContainer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    }
}

// تشغيل وميض التليجرام الانفجاري
const telBtn = document.querySelector('.telegram-link');
if (telBtn) {
    telBtn.addEventListener('click', function(e) {
        this.classList.remove('active-flash');
        this.style.animation = 'none';
        void this.offsetWidth; 
        this.classList.add('active-flash');
        setTimeout(() => {
            this.style.animation = 'telegramPulse 2s infinite';
        }, 500);
    });
}

// وظائف المساعد الذكي جيس (Gace)
function toggleGace() {
    const chatBox = document.getElementById('gace-chat-box');
    const msgDiv = document.getElementById('gace-messages');
    chatBox.classList.toggle('hidden');
    
    // إفراغ الرسائل القديمة عند تغيير اللغة لضمان ظهور الترحيب باللغة الصحيحة
    if (!chatBox.classList.contains('hidden') && msgDiv.innerHTML === "") {
        if (currentLang === 'ar') {
            addMessage("bot", "أهلاً بك في دليل كلية الهندسة! أنا 'جيس' مساعدك الذكي 🤖.");
            addMessage("bot", "كيف تستفيد مني؟ \n• ابحث عن أي دكتور.\n• بعطيك المكتب والإيميل فوراً.\n• اكتب 3 حروف فأكثر 🔍.");
        } else {
            addMessage("bot", "Welcome to the Engineering Guide! I am 'Gace', your smart assistant 🤖.");
            addMessage("bot", "How to use me? \n• Search for any doctor.\n• I'll give you office & email info.\n• Type 3+ characters to start 🔍.");
        }
    }
}

function addMessage(sender, text) {
    const msgDiv = document.getElementById('gace-messages');
    const newMsg = document.createElement('div');
    newMsg.className = `msg ${sender}`;
    newMsg.innerText = text;
    msgDiv.appendChild(newMsg);
    msgDiv.scrollTop = msgDiv.scrollHeight;
}

function askGace() {
    const input = document.getElementById('gace-input');
    const query = input.value.trim();
    if (!query) return;

    addMessage("user", query);
    input.value = "";

    // منطق البحث الذكي
    setTimeout(() => {
        const response = processGaceQuery(query);
        addMessage("bot", response);
    }, 500);
}

function processGaceQuery(query) {
    let cleanQuery = query.toLowerCase().trim();
    let normalizedQuery = normalizeArabic(cleanQuery); // للاستخدام مع البحث العربي
    
    // 1. التحقق من طول النص حسب اللغة
    if (cleanQuery.length < 3) {
        return currentLang === 'ar' 
            ? "يا بشمهندس، عطني 3 حروف فأكثر عشان أركز معك 🤓." 
            : "Engineer, please type 3+ characters so I can help you 🤓.";
    }

    // 2. الردود الفكاهية المترجمة (للاستظراف)
    const jokesAr = ["هلا", "مين", "يا حليل", "أحبك", "يا ذكي", "هندسة"];
    const jokesEn = ["hi", "hello", "who are you", "love you", "smart", "engineer"];
    
    if (jokesAr.some(j => normalizedQuery.includes(j)) || jokesEn.some(j => cleanQuery.includes(j))) {
        return currentLang === 'ar'
            ? "مركزين في الدراسة ولا في الاستظراف؟ ترا الفاينل ما يرحم يا هندسة! 😂"
            : "Focus on your studies, engineer! Finals are coming for you! 😂";
    }

    // 3. منطق البحث المزدوج في البطاقات
    let cards = document.getElementsByClassName('doctor-card');
    for (let i = 0; i < cards.length; i++) {
        let nameAr = normalizeArabic(cards[i].getAttribute('data-name') || "").toLowerCase();
        let nameEn = (cards[i].getAttribute('data-name-en') || "").toLowerCase();
        
        // البحث في كلا الاسمين لضمان ظهور النتيجة مهما كانت لغة الإدخال
        if (normalizedQuery.includes(nameAr) || nameAr.includes(normalizedQuery) || 
            cleanQuery.includes(nameEn) || nameEn.includes(cleanQuery)) {
            
            let specialty = cards[i].getAttribute('data-specialty');
            let office = cards[i].querySelector('p:nth-of-type(2)')?.innerText || "N/A";
            let email = cards[i].querySelector('p:last-of-type')?.innerText || "N/A";
            
            if (currentLang === 'ar') {
                return `لقيت لك الدكتور ${cards[i].getAttribute('data-name')} (قسم ${specialty}) 🎯.\n📍 المكتب: ${office}\n📧 الإيميل: ${email}\nأي خدمة ثانية؟`;
            } else {
                return `I found Dr. ${nameEn || cards[i].getAttribute('data-name')} 🎯.\n📍 Office: ${office}\n📧 Email: ${email}\nAnything else, Engineer?`;
            }
        }
    }
    
    // 4. ردود الفشل المترجمة
    return currentLang === 'ar'
        ? "لفيت الكلية كلها ولا لقيت دكتور بهذا الاسم! تأكد من الاسم يا هندسة 😅."
        : "I've searched everywhere but couldn't find this doctor! Double check the name, Engineer 😅.";
}