// ==== FADE-IN ON SCROLL + STAGGER ====
const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
  threshold: 0.2,               // يظهر لما 20% من العنصر داخل الشاشة
  rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry, index) => {
    if (!entry.isIntersecting) return;

    // تضيف class show بالتتابع لكل عنصر
    setTimeout(() => {
      entry.target.classList.add('show');
    }, index * 200); // 200ms فرق بين العناصر

    // توقف المراقبة بعد ما العنصر ظهر
    observer.unobserve(entry.target);
  });
}, appearOptions);

// بداية المراقبة لكل العناصر
faders.forEach(fader => appearOnScroll.observe(fader));


// ==== VIDEO MODAL ====
function openVideo(url) {
  document.getElementById("videoFrame").src = url;
  document.getElementById("videoModal").style.display = "flex";
}

function closeVideo() {
  document.getElementById("videoModal").style.display = "none";
  document.getElementById("videoFrame").src = "";
}

// اغلاق الفيديو لو ضغطتي برا الـ modal
window.onclick = function(e) {
  const modal = document.getElementById("videoModal");
  if (e.target === modal) closeVideo();
};
