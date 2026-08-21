document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('mobile-menu-btn');
  var menu = document.getElementById('mobile-menu');

  if (btn && menu) {
    btn.addEventListener('click', function () {
      var isHidden = menu.classList.contains('hidden');
      menu.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', String(isHidden));
    });
  }
});
