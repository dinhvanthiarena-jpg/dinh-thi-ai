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

  function appendMessage(role, text) {
    var wrap = document.createElement('div');
    wrap.className = role === 'user' ? 'flex justify-end' : 'flex justify-start';

    var bubble = document.createElement('div');
    bubble.className =
      role === 'user'
        ? 'max-w-[80%] rounded-2xl rounded-br-sm bg-primary-600 text-white px-3 py-2'
        : 'max-w-[80%] rounded-2xl rounded-bl-sm bg-white border border-primary-100 text-ink px-3 py-2';
    bubble.textContent = text;

    wrap.appendChild(bubble);
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function appendTyping() {
    var wrap = document.createElement('div');
    wrap.id = 'chatbot-typing';
    wrap.className = 'flex justify-start';
    wrap.innerHTML =
      '<div class="rounded-2xl rounded-bl-sm bg-white border border-primary-100 text-muted px-3 py-2 text-xs">Đang trả lời...</div>';
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
    if (!messagesEl.childElementCount) {
      appendMessage('assistant', 'Chào bạn, em có thể giúp gì cho bạn không ạ?');
    }
    input.focus();
  }

  function closePanel() {
    panel.classList.add('hidden');
    panel.classList.remove('flex');
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

    fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: text }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        removeTyping();
        var reply = data.reply || 'Xin lỗi anh/chị, em chưa nhận được phản hồi. Vui lòng thử lại.';
        appendMessage('assistant', reply);
        history.push({ role: 'assistant', text: reply });
        saveHistory(history);
      })
      .catch(function () {
        removeTyping();
        appendMessage('assistant', 'Có lỗi kết nối, anh/chị vui lòng thử lại sau ít phút.');
      })
      .finally(function () {
        input.disabled = false;
        input.focus();
      });
  });
})();
