// 1. تعريف المتغيرات بشكل عام لسهولة الوصول
var darkModeToggle = document.getElementById('darkModeToggle');
var body = document.body;

// 2. فحص التفضيل المحفوظ وتشغيله فوراً
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    if (darkModeToggle) darkModeToggle.textContent = '☀️ الوضع النهاري';
}

// 3. وظيفة التبديل (طريقة مباشرة متوافقة مع سفاري)
if (darkModeToggle) {
    darkModeToggle.onclick = function() {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
            darkModeToggle.textContent = '🌙 الوضع الليلي';
        } else {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            darkModeToggle.textContent = '☀️ الوضع النهاري';
        }
    };
}

// 4. دالة البحث والفلترة (تم تحديثها لإظهار رسالة عند عدم وجود نتائج)
function filterDoctors() {
    var searchInput = document.getElementById('searchInput').value.toLowerCase();
    var specialtyFilter = document.getElementById('specialtyFilter').value;
    var cards = document.getElementsByClassName('doctor-card');
    var doctorList = document.querySelector('.doctor-list');
    var visibleCount = 0;

    // حذف الرسالة السابقة إذا كانت موجودة عشان ما تتكرر
    var existingMsg = document.querySelector('.no-results-msg');
    if (existingMsg) existingMsg.remove();

    for (var i = 0; i < cards.length; i++) {
        var doctorSpecialtyData = cards[i].getAttribute('data-specialty') || "";
        var name = cards[i].getAttribute('data-name').toLowerCase();
        
        var matchesSpecialty = (specialtyFilter === 'all' || doctorSpecialtyData.includes(specialtyFilter));
        var matchesSearch = name.includes(searchInput);

        if (matchesSearch && matchesSpecialty) {
            cards[i].style.display = "block";
            visibleCount++; // نحسب الدكاترة اللي طلعوا في البحث
        } else {
            cards[i].style.display = "none";
        }
    }

    // إذا ما فيه أحد طلع (يعني البحث صفر)
    if (visibleCount === 0) {
        var msg = document.createElement('div');
        msg.className = 'no-results-msg';
        msg.innerHTML = "⚠️ عذراً لابوبو، لا يوجد دكتور بهذا الاسم - تواصل معنا في حال لم نضع اسم الدكتور.";
        doctorList.appendChild(msg);
    }
}

// إضافة كود لتحديث شريط التقدم عند التمرير (عشان يشتغل الخط اللي فوق)
window.addEventListener('scroll', function() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    var scrollProgress = document.getElementById("scroll-progress");
    if (scrollProgress) scrollProgress.style.width = scrolled + "%";
});

// 5. دالة نسخ الإيميل
function copyEmail(email) {
    var tempInput = document.createElement("input");
    tempInput.value = email;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    alert("تم نسخ الإيميل: " + email);
}

// 6. دالة نسخ البيانات الكاملة
function copyFullInfo(name, major, office, email) {
    var fullText = "معلومات التواصل مع الدكتور:\nالاسم: " + name + "\nالتخصص: " + major + "\nالمكتب: " + office + "\nالإيميل: " + email;
    var tempTextArea = document.createElement("textarea");
    tempTextArea.value = fullText;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
    alert("تم نسخ جميع بيانات " + name + " بنجاح!");
}

