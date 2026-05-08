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
let itemsToShow = 12; 

// 2. فحص التفضيل المحفوظ للوضع الليلي
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    updateDarkModeButton(true);
}

// 3. وظائف القائمة (الترس)
function toggleMenu() {
    const menu = document.querySelector('.settings-menu');
    if (isDragging) return; 
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
        if (currentLang === 'ar') {
            darkModeToggle.textContent = isDark ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي';
        } else {
            darkModeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
        }
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
        noResults: "⚠️ عذراً، لا يوجد دكتور بهذا الاسم - تواصل معنا لإضافته.",
        loadMore: "عرض المزيد"
    },
    en: {
        title: "College of Engineering",
        subtitle: "Qassim University",
        disclaimer: "Student initiative to facilitate communication, not an official faculty entity.",
        guideTitle: "Office Guide:",
        searchPlholder: "Search by doctor name...",
        langBtn: "🌐 العربية",
        noResults: "⚠️ Sorry, no doctor found with this name - Contact us to add it.",
        loadMore: "Load More"
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

    // تحديث أداة جيس لتغيير لغتها فوراً ورسائل الترحيب
    const gaceInput = document.getElementById('gace-input');
    const gaceHeader = document.querySelector('#gace-header span');
    const msgDiv = document.getElementById('gace-messages');

    if (gaceInput && gaceHeader && msgDiv) {
        msgDiv.innerHTML = ""; 
        pendingDoctorName = null; // تصفير البحث عند تغيير اللغة

        if (currentLang === 'ar') {
            gaceHeader.innerText = ' 🤖 المساعد الذكي "جيس"';
            gaceInput.placeholder = 'اسألني عن أي دكتور...';
            addMessage("bot", "أهلاً بك مع أسطورة كلية الهندسة! أنا 'جيس' مساعدك الذكي 🤖.");
            addMessage("bot", "كيف تستفيد مني؟ \n• ابحث عن أي دكتور بالعربي أو الإنجليزي.\n• بعطيك المكتب والإيميل فوراً.\n• اكتب 3 حروف فأكثر 🔍.");
        } else {
            gaceHeader.innerText = ' 🤖 Smart Assistant "Gace"';
            gaceInput.placeholder = 'Ask me about any doctor...';
            addMessage("bot", "Welcome to the Engineering Guide! I am 'Gace', your smart assistant 🤖.");
            addMessage("bot", "How to use me? \n• Search for any doctor (AR/EN).\n• I'll give you office & email info.\n• Type 3+ characters to start 🔍.");
        }
    }
// تحديث نص زر الوضع الليلي بناءً على اللغة الجديدة
const isDark = body.classList.contains('dark-theme');
updateDarkModeButton(isDark);
    filterDoctors();
}

// 6. دالة البحث والفلترة
function filterDoctors() {
    var searchInputEl = document.getElementById('searchInput');
    if (!searchInputEl) return;
    
    var rawInput = searchInputEl.value.toLowerCase().trim().replace(/\.$/, "");
    var searchInput = normalizeArabic(rawInput); 

    var specialtyFilter = document.getElementById('specialtyFilter').value;
    var cards = document.getElementsByClassName('doctor-card');
    var doctorList = document.querySelector('.doctor-list');
    
    let loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) {
        const container = document.createElement('div');
        container.className = 'load-more-container';
        container.innerHTML = `<button id="loadMoreBtn" style="display:none;">عرض المزيد</button>`;
        doctorList.parentNode.insertBefore(container, doctorList.nextSibling);
        loadMoreBtn = document.getElementById('loadMoreBtn');
        loadMoreBtn.onclick = function() {
            itemsToShow += 12;
            filterDoctors();
        };
    }

    var visibleMatches = [];
    var existingMsg = document.querySelector('.no-results-msg');
    if (existingMsg) existingMsg.remove();

    for (var i = 0; i < cards.length; i++) {
        var specialty = cards[i].getAttribute('data-specialty') || "";
        var nameArRaw = cards[i].getAttribute('data-name') || "";
        var nameAr = normalizeArabic(nameArRaw.toLowerCase());
        var nameEn = (cards[i].getAttribute('data-name-en') || "").toLowerCase();
        
        var matchesSpecialty = (specialtyFilter === 'all' || specialty === specialtyFilter);
        var matchesSearch = nameAr.includes(searchInput) || nameEn.includes(searchInput);

        if (matchesSearch && matchesSpecialty) {
            visibleMatches.push(cards[i]);
        } else {
            cards[i].style.display = "none";
        }
    }

    for (var j = 0; j < visibleMatches.length; j++) {
        if (j < itemsToShow) {
            visibleMatches[j].style.display = "block";
        } else {
            visibleMatches[j].style.display = "none";
        }
    }

    loadMoreBtn.style.display = (visibleMatches.length > itemsToShow) ? "inline-block" : "none";
    loadMoreBtn.innerText = translations[currentLang].loadMore;

    if (visibleMatches.length === 0 && doctorList) {
        var msg = document.createElement('div');
        msg.className = 'no-results-msg';
        msg.innerHTML = translations[currentLang].noResults;
        doctorList.appendChild(msg);
    }
}

document.getElementById('searchInput').addEventListener('input', () => { itemsToShow = 12; });
document.getElementById('specialtyFilter').addEventListener('change', () => { itemsToShow = 12; });

// 7. شريط التقدم
window.addEventListener('scroll', function() {
    var winScroll = body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    var scrollProgress = document.getElementById("scroll-progress");
    if (scrollProgress) scrollProgress.style.width = scrolled + "%";
});

// 8. وظائف النسخ
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

if (menuContainer) {
    menuContainer.addEventListener("touchstart", dragStart, { passive: false });
    menuContainer.addEventListener("touchend", dragEnd, { passive: false });
    menuContainer.addEventListener("touchmove", drag, { passive: false });
    menuContainer.addEventListener("mousedown", dragStart, false);
    document.addEventListener("mouseup", dragEnd, false);
    document.addEventListener("mousemove", drag, false);
}

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

// وميض الإيميل
const emailBtn = document.querySelector('.email-link');
if (emailBtn) {
    emailBtn.addEventListener('click', function(e) {
        const self = this;
        self.classList.remove('active-flash');
        self.style.animation = 'none';
        self.style.webkitAnimation = 'none';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                self.classList.add('active-flash');
                setTimeout(() => {
                    self.style.animation = 'pulseGlow 2s infinite';
                    self.style.webkitAnimation = 'pulseGlow 2s infinite';
                }, 600);
            });
        });
    });
}

// وظائف جيس (Gace)
function toggleGace() {
    const chatBox = document.getElementById('gace-chat-box');
    const msgDiv = document.getElementById('gace-messages');
    chatBox.classList.toggle('hidden');
    
    if (!chatBox.classList.contains('hidden') && msgDiv.innerHTML === "") {
        if (currentLang === 'ar') {
            addMessage("bot", "أهلاً بك مع أسطورة كلية الهندسة! أنا 'جيس' مساعدك الذكي 🤖.");
            addMessage("bot", "كيف تستفيد مني؟ \n• ابحث عن أي دكتور بالعربي أو الإنجليزي.\n• بعطيك المكتب والإيميل فوراً.\n• اكتب 3 حروف فأكثر 🔍.");
        } else {
            addMessage("bot", "Welcome to the Engineering Guide! I am 'Gace', your smart assistant 🤖.");
            addMessage("bot", "How to use me? \n• Search for any doctor (AR/EN).\n• I'll give you office & email info.\n• Type 3+ characters to start 🔍.");
        }
    }
}

function addMessage(sender, text) {
    const msgDiv = document.getElementById('gace-messages');
    if (!msgDiv) return;
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
    setTimeout(() => {
        const response = processGaceQuery(query);
        addMessage("bot", response);
    }, 500);
}

let pendingDoctorName = null; 

function processGaceQuery(query) {
    let cleanQuery = query.toLowerCase().trim();
    let normalizedQuery = normalizeArabic(cleanQuery);

    function getMajorCategory(text) {
        let t = normalizeArabic(text || "").toLowerCase();
        if (/كهرب|اتصالا|حاسب|الكترون|elec|computer|telecom|eng/.test(t)) return "كهرباء";
        if (/ميكا|الات|تصميم|حرار|انتاج|mech|power|prod|eng/.test(t)) return "ميكانيكا";
        if (/مدن|انشاء|طرق|خرسان|civil|structure|road|eng/.test(t)) return "مدنية";
        return t;
    }

    if (pendingDoctorName) {
        let studentChoice = getMajorCategory(normalizedQuery);
        let cards = document.getElementsByClassName('doctor-card');
        let finalMatches = []; 
        
        for (let i = 0; i < cards.length; i++) {
            let nameAr = normalizeArabic(cards[i].getAttribute('data-name') || "").toLowerCase();
            let nameEn = (cards[i].getAttribute('data-name-en') || "").toLowerCase();
            let doctorMajor = getMajorCategory(cards[i].getAttribute('data-specialty') || "");

            if ((nameAr.includes(pendingDoctorName) || nameEn.includes(pendingDoctorName)) && doctorMajor === studentChoice) {
                let office = cards[i].querySelector('p:nth-of-type(2)')?.innerText || "غير مسجل";
                let email = cards[i].querySelector('p:last-of-type')?.innerText || "غير مسجل";
                let dName = currentLang === 'ar' ? cards[i].getAttribute('data-name') : cards[i].getAttribute('data-name-en');
                finalMatches.push(`👤 د. ${dName}\n📍 المكتب: ${office}\n📧 ${email}`);
            }
        }

        if (finalMatches.length > 0) {
            pendingDoctorName = null; 
            let header = currentLang === 'ar' ? "✅ وجدت المطلوب:" : "✅ Results found:";
            return header + "\n\n" + finalMatches.join("\n" + "-".repeat(15) + "\n");
        }
        pendingDoctorName = null; // تصفير عند عدم المطابقة
        return currentLang === 'ar' 
            ? "💡 ملاحظة: لم أجد أحداً بهذا الاسم في هذا القسم. جرب اسماً آخر." 
            : "💡 Note: No matches in this major. Try another name.";
    }

    const jokes = ["هلا", "مين", "تحس", "أحبك", "ذكي", "تعبت", "هندسة", "hello", "hi", "bot"];
    if (jokes.some(j => cleanQuery.includes(j)) && cleanQuery.length < 10) {
        const funnyReplies = currentLang === 'ar' ? [
            "مركز في الاستظراف وناسي الكويز؟ اخلص عطني اسم الدكتور 😂",
            "وفر ظرافتك للدكاترة، أنا جيس مبرمج للعمل! تبي دكتور؟ ☕"
        ] : ["Focus on your studies, engineer! 😂 Give me a doctor name."];
        return funnyReplies[Math.floor(Math.random() * funnyReplies.length)];
    }

    if (cleanQuery.length < 3) {
        return currentLang === 'ar' 
            ? "📝 ملاحظة: الاسم قصير. اكتب (الأول أو اللقب) بوضوح."
            : "📝 Note: Name too short. Use first or last name.";
    }

    let cards = document.getElementsByClassName('doctor-card');
    let matches = [];
    let detectedMajorInQuery = getMajorCategory(cleanQuery);

    for (let i = 0; i < cards.length; i++) {
        let nameAr = normalizeArabic(cards[i].getAttribute('data-name') || "").toLowerCase();
        let nameEn = (cards[i].getAttribute('data-name-en') || "").toLowerCase();
        let doctorMajor = getMajorCategory(cards[i].getAttribute('data-specialty') || "");
        
        let nameMatch = normalizedQuery.includes(nameAr) || nameAr.includes(normalizedQuery) || 
                        cleanQuery.includes(nameEn) || nameEn.includes(cleanQuery);

        if (nameMatch) {
            if (["كهرباء", "ميكانيكا", "مدنية"].includes(detectedMajorInQuery)) {
                if (doctorMajor === detectedMajorInQuery) matches.push(cards[i]);
            } else {
                matches.push(cards[i]);
            }
        }
    }

    if (matches.length === 1) {
        pendingDoctorName = null;
        let c = matches[0];
        let office = c.querySelector('p:nth-of-type(2)')?.innerText || "غير مسجل";
        let email = c.querySelector('p:last-of-type')?.innerText || "غير مسجل";
        let dName = currentLang === 'ar' ? c.getAttribute('data-name') : c.getAttribute('data-name-en');
        return `🎯 ${currentLang === 'ar' ? 'بيانات الدكتور' : 'Doctor Details'}: \n👤 ${dName} \n📍 ${office} \n📧 ${email}`;
    } 
    else if (matches.length > 1) {
        pendingDoctorName = cleanQuery;
        return currentLang === 'ar'
            ? `🧐 وجدت ${matches.length} دكاترة بهذا الاسم. \n💡 اكتب التخصص الآن (كهرب، ميكا، مدني) عشان أحصرهم لك.`
            : `🧐 Found ${matches.length} doctors. \n💡 Type the major (Elec, Mech, Civil) to filter them.`;
    }

    pendingDoctorName = null; 
    return currentLang === 'ar' 
        ? "❌ لم أعثر على نتائج. \n💡 جرب كتابة اسم الدكتور الأول أو اللقب." 
        : "❌ No results. \n💡 Try typing the first or last name.";
}

window.onload = filterDoctors;