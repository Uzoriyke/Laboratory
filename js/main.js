// ============================================================
// REMAR MEDICAL LABORATORIES — shared site behaviour
// ============================================================

(function themeInit(){
  var saved = localStorage.getItem('remar-theme');
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', function () {

  // ---- Theme toggle ----
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var html = document.documentElement;
      var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('remar-theme', next);
    });
  }

  // ---- Mobile nav toggle ----
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      var expanded = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded);
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { navLinks.classList.remove('open'); });
    });
  }

  // ---- Active nav link ----
  var current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === current) a.classList.add('active');
  });

  // ---- Publications filter/search (publications.html only) ----
  var pubList = document.querySelector('[data-pub-list]');
  if (pubList) {
    var items = Array.prototype.slice.call(pubList.querySelectorAll('[data-year]'));
    var yearButtons = document.querySelectorAll('[data-year-filter]');
    var searchInput = document.querySelector('[data-pub-search]');
    var emptyState = document.querySelector('[data-pub-empty]');
    var activeYear = 'all';

    function applyFilters() {
      var term = (searchInput && searchInput.value || '').trim().toLowerCase();
      var visibleCount = 0;
      items.forEach(function (item) {
        var matchesYear = activeYear === 'all' || item.getAttribute('data-year') === activeYear;
        var matchesTerm = !term || item.textContent.toLowerCase().indexOf(term) !== -1;
        var show = matchesYear && matchesTerm;
        item.style.display = show ? '' : 'none';
        if (show) visibleCount++;
      });
      if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    yearButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        yearButtons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        activeYear = btn.getAttribute('data-year-filter');
        applyFilters();
      });
    });

    if (searchInput) searchInput.addEventListener('input', applyFilters);
  }

  // ---- Contact form status message ----
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', function () {
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending…';
      }
    });
  }

  // ---- Footer year ----
  document.querySelectorAll('[data-current-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
});
