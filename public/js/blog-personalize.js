(function () {
  var HISTORY_KEY = 'bp_history';
  var MAX_HISTORY = 30;
  var container = document.getElementById('personalizedPicks');
  var meta = window.__blogPostMeta || null;

  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveHistory(history) {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-MAX_HISTORY)));
    } catch (e) {
      // localStorage bị chặn (private mode, cookie bị tắt...) — bỏ qua, không có gì vỡ.
    }
  }

  function topCategories(history, limit) {
    var count = {};
    history.forEach(function (c) { count[c] = (count[c] || 0) + 1; });
    return Object.keys(count)
      .sort(function (a, b) { return count[b] - count[a]; })
      .slice(0, limit);
  }

  var history = getHistory();
  if (meta && meta.category) {
    history.push(meta.category);
    saveHistory(history);
  }

  if (!container) return;

  var categories = topCategories(history, 2);
  if (!categories.length) return;

  var url = '/blog/api/recommended?categories=' + encodeURIComponent(categories.join(','));
  if (meta && meta.id) url += '&exclude=' + encodeURIComponent(meta.id);

  fetch(url)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var posts = (data && data.posts) || [];
      if (!posts.length) return;

      var html = posts
        .map(function (p) {
          return (
            '<a href="/blog/' + p.slug + '" class="card overflow-hidden group">' +
            '<div class="aspect-video bg-primary-50 overflow-hidden">' +
            '<img src="' + p.coverImageUrl + '" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />' +
            '</div>' +
            '<div class="p-4"><h3 class="font-semibold text-sm text-ink line-clamp-2 group-hover:text-primary-700">' + p.title + '</h3></div>' +
            '</a>'
          );
        })
        .join('');

      container.innerHTML =
        '<h2 class="text-xl font-bold text-ink mb-6">Gợi ý riêng cho bạn</h2>' +
        '<div class="grid sm:grid-cols-3 gap-6">' + html + '</div>';
      container.classList.remove('hidden');
    })
    .catch(function () {});
})();
