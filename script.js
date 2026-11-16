(function () {
  "use strict";

  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", function (event) {
    if (event.target.tagName === "A" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll(".work-item"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip"));
  var emptyState = document.getElementById("empty-state");

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var filter = chip.dataset.filter;
      var shown = 0;

      chips.forEach(function (other) {
        other.classList.toggle("is-active", other === chip);
      });

      cards.forEach(function (card) {
        var tags = (card.dataset.tags || "").split(/\s+/);
        var match = filter === "all" || tags.indexOf(filter) !== -1;
        card.hidden = !match;
        if (match) shown += 1;
      });

      emptyState.hidden = shown !== 0;
    });
  });

  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  function bindCopyButton(button) {
    if (!button) return;

    var label = button.querySelector(".btn-label") || button;
    var originalText = label.textContent;

    button.addEventListener("click", function () {
      var email = button.dataset.email;

      var done = function () {
        label.textContent = "Tersalin ke clipboard";
        button.classList.add("is-done");
        window.setTimeout(function () {
          label.textContent = originalText;
          button.classList.remove("is-done");
        }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, function () {
          window.prompt("Salin manual:", email);
        });
      } else {
        window.prompt("Salin manual:", email);
      }
    });
  }

  bindCopyButton(document.getElementById("copy-email"));
  bindCopyButton(document.getElementById("copy-email-2"));

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
