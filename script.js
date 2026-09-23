
// 1. A flashlight cursor: the page goes dark and only a circle around the
//    mouse is lit, so evidence on the page has to be searched for rather
//    than just looked at. This is the site's main interactive idea.
// 2. A lightbox for the evidence photos on the Film page, so each piece
//    of evidence can be pulled out and examined full-size.

document.addEventListener("DOMContentLoaded", () => {
  initFlashlight();
  initLightbox();
});

function initFlashlight() {
  const toggle = document.querySelector("[data-flashlight-toggle]");
  const overlay = document.getElementById("flashlight-overlay");
  if (!toggle || !overlay) return;

  // On the page that has it, the flashlight starts on
  let active = true;
  document.body.classList.add("flashlight-on");
  setPosition(window.innerWidth / 2, window.innerHeight / 2);

  function setPosition(x, y) {
    document.body.style.setProperty("--mx", x + "px");
    document.body.style.setProperty("--my", y + "px");
  }

  toggle.addEventListener("click", () => {
    active = !active;
    document.body.classList.toggle("flashlight-on", active);
    toggle.textContent = active ? "\u2715 Put the flashlight away" : "\uD83D\uDD26 Search with a flashlight";
    toggle.setAttribute("aria-pressed", String(active));
    if (active) setPosition(window.innerWidth / 2, window.innerHeight / 2);
  });

  window.addEventListener("mousemove", (e) => {
    if (active) setPosition(e.clientX, e.clientY);
  });
}

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  const lightboxImg = lightbox.querySelector("img");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  document.querySelectorAll("[data-evidence]").forEach((item) => {
    item.addEventListener("click", () => {
      const src = item.querySelector("img").getAttribute("src");
      const alt = item.querySelector("img").getAttribute("alt");
      lightboxImg.setAttribute("src", src);
      lightboxImg.setAttribute("alt", alt);
      lightbox.classList.add("open");
    });
  });

  function close() {
    lightbox.classList.remove("open");
    lightboxImg.setAttribute("src", "");
  }
  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}
