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

// 4. دالة البحث والفلترة
function filterDoctors() {
    var searchInput = document.getElementById('searchInput').value.toLowerCase();
    var specialtyFilter = document.getElementById('specialtyFilter').value;
    var cards = document.getElementsByClassName('doctor-card');

    for (var i = 0; i < cards.length; i++) {
        // نجلب نص التخصصات بالكامل من البطاقة
        var doctorSpecialtyData = cards[i].getAttribute('data-specialty') || "";
        var name = cards[i].getAttribute('data-name').toLowerCase();
        
        // فحص التخصص: ينجح إذا كان الخيار "الكل" أو إذا كان التخصص المختار موجوداً ضمن بيانات الدكتور
        var matchesSpecialty = (specialtyFilter === 'all' || doctorSpecialtyData.includes(specialtyFilter));
        var matchesSearch = name.includes(searchInput);

        if (matchesSearch && matchesSpecialty) {
            cards[i].style.display = "block";
        } else {
            cards[i].style.display = "none";
        }
    }
}

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