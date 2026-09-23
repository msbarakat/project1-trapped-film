// 1. A flashlight cursor (Film page only): the page goes dark and only a
//    circle around the mouse is lit.
// 2. A lightbox for the evidence photos on the Film page, so each piece
//    of evidence can be pulled out and examined full-size.
//
// Both functions check for the elements they need before doing anything,
// so that this can be included on every page

document.addEventListener("DOMContentLoaded", () => {
  initFlashlight();
  initLightbox();
});

function initFlashlight() {
  // [data-flashlight-toggle] is a data attribute in the HTML, used instead of
  // a class so the selector doesn't depend on whatever class the button is styled with.
  const toggle = document.querySelector("[data-flashlight-toggle]");
  const overlay = document.getElementById("flashlight-overlay");
  if (!toggle || !overlay) return; // do nothing on pages without a flashlight button

  // The flashlight starts ON as soon as the page loads so the evidence board is dark by default
  let active = true;
  document.body.classList.add("flashlight-on");
  setPosition(window.innerWidth / 2, window.innerHeight / 2); // center of screen, before the mouse has moved

  // Writes the cursor position into two CSS properties. The actual moving/lighting 
  // effect is done in CSS (#flashlight-overlay in style.css).
  function setPosition(x, y) {
    document.body.style.setProperty("--mx", x + "px");
    document.body.style.setProperty("--my", y + "px");
  }

  // Clicking the button flips the flashlight on/off, updates its own label
  // and aria-pressed state, and re-centers the light if it was just turned on.
  toggle.addEventListener("click", () => {
    active = !active;
    document.body.classList.toggle("flashlight-on", active);
    toggle.textContent = active ? "\u2715 Put the flashlight away" : "\uD83D\uDD26 Search with a flashlight";
    toggle.setAttribute("aria-pressed", String(active));
    if (active) setPosition(window.innerWidth / 2, window.innerHeight / 2);
  });

  // Only update the light's position while it's actually switched on
  window.addEventListener("mousemove", (e) => {
    if (active) setPosition(e.clientX, e.clientY);
  });
}

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return; // pages without a #lightbox (Home, Watch) skip this 

  const lightboxImg = lightbox.querySelector("img");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  // [data-evidence] marks every clickable evidence photo. For each one,
  // clicking copies that photo's src/alt into the single shared lightbox
  // image and reveals it (via the .open class).
  document.querySelectorAll("[data-evidence]").forEach((item) => {
    item.addEventListener("click", () => {
      const src = item.querySelector("img").getAttribute("src");
      const alt = item.querySelector("img").getAttribute("alt");
      lightboxImg.setAttribute("src", src);
      lightboxImg.setAttribute("alt", alt);
      lightbox.classList.add("open");
    });
  });

  // One shared close function
  function close() {
    lightbox.classList.remove("open");
    lightboxImg.setAttribute("src", ""); // clear the image so it isn't still loaded while hidden
  }

  closeBtn.addEventListener("click", close);

  // Clicking the dark backdrop closes it too, but only if the click landed on
  // the backdrop itself and not on the image
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  // Escape key closes it from anywhere on the page
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}
