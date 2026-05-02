// دالة تبديل الوضع (متوافقة 100% مع سفاري آيفون)
function toggleMyTheme() {
    var body = document.body;
    var btn = document.getElementById('darkModeToggle');
    
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        if (btn) btn.textContent = '🌙 الوضع الليلي';
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        if (btn) btn.textContent = '☀️ الوضع النهاري';
    }
}

// تشغيل الوضع المحفوظ عند فتح الصفحة
(function() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        // ننتظر قليلاً لضمان تحميل الزر وتغيير نصه
        window.onload = function() {
            var btn = document.getElementById('darkModeToggle');
            if (btn) btn.textContent = '☀️ الوضع النهاري';
        };
    }
})();

// دالة البحث والفلترة
function filterDoctors() {
    var searchInput = document.getElementById('searchInput').value.toLowerCase();
    var specialtyFilter = document.getElementById('specialtyFilter').value;
    var cards = document.getElementsByClassName('doctor-card');

    for (var i = 0; i < cards.length; i++) {
        var name = cards[i].getAttribute('data-name').toLowerCase();
        var specialty = cards[i].getAttribute('data-specialty');
        var matchesSearch = name.indexOf(searchInput) > -1;
        var matchesSpecialty = (specialtyFilter === 'all' || specialty === specialtyFilter);
        cards[i].style.display = (matchesSearch && matchesSpecialty) ? "block" : "none";
    }
}

// دالة نسخ الإيميل (متوافقة مع آيفون)
function copyEmail(email) {
    navigator.clipboard.writeText(email).then(function() {
        alert("تم نسخ الإيميل: " + email);
    });
}

// دالة نسخ البيانات الكاملة (متوافقة مع آيفون)
function copyFullInfo(name, major, office, email) {
    var fullText = "دليل دكاترة الهندسة:\nالاسم: " + name + "\nالتخصص: " + major + "\nالمكتب: " + office + "\nالإيميل: " + email;
    navigator.clipboard.writeText(fullText).then(function() {
        alert("تم نسخ جميع بيانات " + name + " بنجاح!");
    });
}