(function () {
  var root = document.getElementById('chatbot-root');
  if (!root) return;

  var toggleBtn = document.getElementById('chatbot-toggle');
  var closeBtn = document.getElementById('chatbot-close');
  var panel = document.getElementById('chatbot-panel');
  var messagesEl = document.getElementById('chatbot-messages');
  var form = document.getElementById('chatbot-form');
  var input = document.getElementById('chatbot-input');

  var STORAGE_KEY = 'dta_chat_history';
  var opened = false;

  function loadHistory() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(history) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-40)));
    } catch (e) {
      /* ignore quota errors */
    }
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Renders the limited markdown Claude is prompted to use (links, bold,
  // line breaks) as real HTML. Input is HTML-escaped first so nothing the
  // model outputs can inject markup outside these specific patterns.
  function renderRichText(text) {
    var escaped = escapeHtml(text);
    var withLinks = escaped.replace(/\[([^\]]+)\]\((\/[^\s)]*|https?:\/\/[^\s)]+)\)/g, function (match, label, url) {
      return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline hover:text-primary-700">' + label + '</a>';
    });
    var withBold = withLinks.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return withBold.replace(/\n/g, '<br>');
  }

  function appendMessage(role, text) {
    var wrap = document.createElement('div');
    wrap.className = role === 'user' ? 'flex justify-end' : 'flex justify-start';

    var bubble = document.createElement('div');
    bubble.className =
      role === 'user'
        ? 'max-w-[80%] rounded-2xl rounded-br-sm bg-primary-600 text-white px-3 py-2 whitespace-pre-line'
        : 'max-w-[80%] rounded-2xl rounded-bl-sm bg-white border border-primary-100 text-ink px-3 py-2 leading-relaxed';
    if (role === 'user') {
      bubble.textContent = text;
    } else {
      bubble.innerHTML = renderRichText(text);
    }

    wrap.appendChild(bubble);
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function appendTyping() {
    var wrap = document.createElement('div');
    wrap.id = 'chatbot-typing';
    wrap.className = 'flex justify-start';
    wrap.innerHTML =
      '<div class="rounded-2xl rounded-bl-sm bg-white border border-primary-100 px-4 py-3 flex items-center gap-1">' +
      '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>' +
      '</div>';
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function removeTyping() {
    var el = document.getElementById('chatbot-typing');
    if (el) el.remove();
  }

  function openPanel() {
    panel.classList.remove('hidden');
    panel.classList.add('flex');
    opened = true;
    if (window.matchMedia('(max-width: 639px)').matches) lockBodyScroll();
    if (!messagesEl.childElementCount) {
      appendTyping();
      setTimeout(function () {
        removeTyping();
        appendMessage(
          'assistant',
          'Dạ em chào anh/chị ạ! Em có thể giúp gì cho anh/chị không ạ? Không biết em có thể gọi anh/chị là gì để tiện xưng hô nhé 😊'
        );
      }, 1400);
    }
    input.focus();
  }

  // Khi khung chat mở toàn màn hình trên điện thoại, khóa cuộn trang nền lại
  // — nếu không, Safari/Chrome di động có thể tự cuộn trang phía sau khi
  // người dùng chạm vào ô nhập trong khung "fixed", khiến cả khung như bị
  // "nhảy" lệch vị trí khi bàn phím ảo mở lên (đúng lỗi thầy gặp).
  var scrollYBeforeOpen = 0;
  function lockBodyScroll() {
    scrollYBeforeOpen = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + scrollYBeforeOpen + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }
  function unlockBodyScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollYBeforeOpen);
  }

  function closePanel() {
    panel.classList.add('hidden');
    panel.classList.remove('flex');
    if (window.matchMedia('(max-width: 639px)').matches) unlockBodyScroll();
  }

  toggleBtn.addEventListener('click', function () {
    if (opened && !panel.classList.contains('hidden')) {
      closePanel();
    } else {
      openPanel();
    }
  });
  closeBtn.addEventListener('click', closePanel);

  var history = loadHistory();
  history.forEach(function (m) {
    appendMessage(m.role, m.text);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;

    appendMessage('user', text);
    history.push({ role: 'user', text: text });
    saveHistory(history);
    input.value = '';
    input.disabled = true;
    appendTyping();
    var typingStartedAt = Date.now();
    var BASE_TYPING_MS = 2000;
    var MS_PER_CHAR = 32;
    var MAX_TYPING_MS = 6000;

    // Scales the simulated "typing" delay with reply length so short and
    // long answers don't both appear after the same fixed pause.
    function showAfterMinDelay(fn, replyText) {
      var target = Math.min(
        BASE_TYPING_MS + (replyText ? replyText.length * MS_PER_CHAR : 0),
        MAX_TYPING_MS
      );
      var elapsed = Date.now() - typingStartedAt;
      var wait = Math.max(0, target - elapsed);
      setTimeout(fn, wait);
    }

    fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: text }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        var reply = data.reply || 'Xin lỗi anh/chị, em chưa nhận được phản hồi. Vui lòng thử lại.';
        showAfterMinDelay(function () {
          removeTyping();
          appendMessage('assistant', reply);
          history.push({ role: 'assistant', text: reply });
          saveHistory(history);
          input.disabled = false;
          input.focus();
        }, reply);
      })
      .catch(function () {
        showAfterMinDelay(function () {
          removeTyping();
          appendMessage('assistant', 'Có lỗi kết nối, anh/chị vui lòng thử lại sau ít phút.');
          input.disabled = false;
          input.focus();
        });
      });
  });
})();
