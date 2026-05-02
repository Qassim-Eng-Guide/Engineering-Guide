function copyEmail(email) {
  navigator.clipboard.writeText(email)
    .then(() => alert("تم نسخ الإيميل"))
    .catch(() => alert("تعذر نسخ الإيميل"));
}

function filterDoctors() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  const selectedSpecialty = document.getElementById("specialtyFilter").value;
  const cards = document.querySelectorAll(".doctor-card");

  cards.forEach(card => {
    const name = card.getAttribute("data-name").toLowerCase();
    const specialty = card.getAttribute("data-specialty");

    const matchesName = name.includes(searchValue);
    // التحقق من مطابقة التخصص أو اختيار "كل التخصصات"
    const matchesSpecialty = selectedSpecialty === "all" || specialty === selectedSpecialty;

    if (matchesName && matchesSpecialty) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}