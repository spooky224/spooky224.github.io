(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('#site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('is-open', !open);
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
        nav.classList.remove('is-open');
      });
    });
  }
  var year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries, current) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          current.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (item) { observer.observe(item); });
  } else {
    items.forEach(function (item) { item.classList.add('is-visible'); });
  }
})();

(function () {
  document.querySelectorAll("[data-gallery]").forEach(function (gallery) {
    var files = (gallery.getAttribute("data-gallery-files") || "").split(",").map(function (file) { return file.trim(); }).filter(Boolean);
    var projectName = gallery.getAttribute("data-gallery-name") || "Project";
    var stage = gallery.querySelector("[data-gallery-stage]");
    var image = gallery.querySelector("[data-gallery-image]");
    var counter = gallery.querySelector("[data-gallery-count]");
    var previous = gallery.querySelector("[data-gallery-prev]");
    var next = gallery.querySelector("[data-gallery-next]");
    var index = 0;
    var startPoint = null;

    function showImage(nextIndex) {
      if (!files.length) return;
      index = (nextIndex + files.length) % files.length;
      image.src = "assets/" + files[index];
      image.alt = projectName + " application screenshot " + (index + 1) + " of " + files.length;
      counter.textContent = String(index + 1).padStart(2, "0") + " / " + String(files.length).padStart(2, "0");
      var preload = new Image();
      preload.src = "assets/" + files[(index + 1) % files.length];
    }

    previous.addEventListener("click", function () { showImage(index - 1); });
    next.addEventListener("click", function () { showImage(index + 1); });
    stage.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showImage(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showImage(index + 1);
      }
    });
    stage.addEventListener("pointerdown", function (event) {
      startPoint = { x: event.clientX, y: event.clientY };
    });
    stage.addEventListener("pointerup", function (event) {
      if (!startPoint) return;
      var dx = event.clientX - startPoint.x;
      var dy = event.clientY - startPoint.y;
      if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
        showImage(index + (dx < 0 ? 1 : -1));
      }
      startPoint = null;
    });
    stage.addEventListener("pointercancel", function () { startPoint = null; });
  });
})();
