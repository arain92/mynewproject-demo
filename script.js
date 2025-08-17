(function () {
  const doc = document.documentElement;
  const storageKey = "preferred-theme";

  function getSystemPref() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme(theme) {
    doc.setAttribute('data-theme', theme);
    const pressed = theme === 'dark';
    document.querySelectorAll('#themeToggle, #themeToggleMobile').forEach(btn => {
      if (btn) btn.setAttribute('aria-pressed', String(pressed));
    });
  }
  function initTheme() {
    const stored = localStorage.getItem(storageKey);
    const theme = stored || getSystemPref();
    applyTheme(theme);
  }
  function toggleTheme() {
    const current = doc.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    localStorage.setItem(storageKey, next);
    applyTheme(next);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    const themeBtn = document.getElementById('themeToggle');
    const themeBtnMobile = document.getElementById('themeToggleMobile');
    themeBtn && themeBtn.addEventListener('click', toggleTheme);
    themeBtnMobile && themeBtnMobile.addEventListener('click', toggleTheme);

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const closeSidebar = () => {
      if (sidebar && sidebar.classList.contains('is-open')) {
        sidebar.classList.remove('is-open');
        menuToggle && menuToggle.setAttribute('aria-expanded', 'false');
      }
    };
    menuToggle && menuToggle.addEventListener('click', () => {
      if (!sidebar) return;
      const isOpen = sidebar.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeSidebar();
      });
    });

    const sections = Array.from(document.querySelectorAll('main .section'));
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));

    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (!id) return;
          navLinks.forEach(l => l.classList.remove('is-active'));
          const active = navLinks.find(l => l.getAttribute('href') === `#${id}`);
          if (active) active.classList.add('is-active');
        }
      });
    }, { rootMargin: '-50% 0px -40% 0px', threshold: 0.01 });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    sections.forEach(sec => {
      spyObserver.observe(sec);
      if (sec.classList.contains('reveal')) revealObserver.observe(sec);
    });

    const form = document.getElementById('contactForm');
    const sendBtn = document.getElementById('sendBtn');
    const errName = document.getElementById('error-name');
    const errEmail = document.getElementById('error-email');
    const errMessage = document.getElementById('error-message');
    const emailPattern = /[^@\s]+@[^@\s]+\.[^@\s]+/;

    form && form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form) return;
      const name = /** @type {HTMLInputElement} */(form.querySelector('#name')).value.trim();
      const email = /** @type {HTMLInputElement} */(form.querySelector('#email')).value.trim();
      const message = /** @type {HTMLTextAreaElement} */(form.querySelector('#message')).value.trim();

      let ok = true;
      errName && (errName.textContent = '');
      errEmail && (errEmail.textContent = '');
      errMessage && (errMessage.textContent = '');

      if (!name) { ok = false; if (errName) errName.textContent = 'Please enter your name.'; }
      if (!email || !emailPattern.test(email)) { ok = false; if (errEmail) errEmail.textContent = 'Enter a valid email.'; }
      if (!message || message.length < 10) { ok = false; if (errMessage) errMessage.textContent = 'Message should be at least 10 characters.'; }
      if (!ok) return;

      sendBtn && (sendBtn.disabled = true, sendBtn.textContent = 'Sending…');
      await new Promise(r => setTimeout(r, 900));
      alert('Thanks! Your message has been recorded locally. Configure a backend to send emails.');
      form.reset();
      sendBtn && (sendBtn.disabled = false, sendBtn.textContent = 'Send message');
    });

    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbot = document.getElementById('chatbot');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatBody = document.getElementById('chatBody');
    const chatForm = document.getElementById('chatForm');
    const chatMessage = document.getElementById('chatMessage');

    function openChat() {
      if (!chatbot) return;
      chatbot.hidden = false;
      chatbot.setAttribute('aria-expanded', 'true');
      chatMessage && chatMessage.focus();
      if (chatBody && chatBody.scrollHeight) chatBody.scrollTop = chatBody.scrollHeight;
    }
    function closeChat() {
      if (!chatbot) return;
      chatbot.hidden = true;
      chatbot.setAttribute('aria-expanded', 'false');
    }

    chatbotToggle && chatbotToggle.addEventListener('click', () => {
      if (!chatbot) return;
      if (chatbot.hidden) openChat(); else closeChat();
    });
    chatbotClose && chatbotClose.addEventListener('click', closeChat);

    const knowledge = [
      { q: /hello|hi|hey/i, a: 'Hello! I\'m Alex — a software engineer. Ask me about my skills, experience, projects, or how to contact me.' },
      { q: /who are you|your name|about you|tell me about alex/i, a: 'I\'m Alex Doe, a software engineer focused on building clean, accessible, and performant web apps.' },
      { q: /skills?|tech|stack/i, a: 'Core skills: JavaScript/TypeScript, React, Node.js, CSS, Python, accessibility, and design systems.' },
      { q: /experience|work|background/i, a: 'I\'ve led front-end architecture, shipped large-scale features, and mentored teams — most recently at Acme Inc.' },
      { q: /projects?|portfolio|work/i, a: 'Check out highlighted projects like Aurora (viz dashboard), Nova API, and Atlas UI in the Projects section.' },
      { q: /contact|reach|email/i, a: 'Email me at hello@yourdomain.com or use the contact form below.' },
      { q: /resume|cv|download/i, a: 'You can download my resume via the buttons on the Home and Resume sections.' },
      { q: /social|github|linkedin|twitter/i, a: 'GitHub: github.com/yourhandle, LinkedIn: linkedin.com/in/yourhandle, Twitter: twitter.com/yourhandle' },
      { q: /location|where/i, a: 'I work remotely and am open to opportunities globally.' },
    ];

    function answerFor(input) {
      for (const item of knowledge) {
        if (item.q.test(input)) return item.a;
      }
      return "I can help with skills, experience, projects, resume, and contact details. Try: ‘What skills do you have?’";
    }

    function pushMessage(role, text) {
      if (!chatBody) return;
      const wrap = document.createElement('div');
      wrap.className = `message ${role}`;
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.textContent = text;
      wrap.appendChild(bubble);
      chatBody.appendChild(wrap);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    document.getElementById('chatSuggestions')?.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const q = target.getAttribute('data-q');
      if (!q) return;
      if (chatMessage) chatMessage.value = q;
      chatForm?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });

    chatForm && chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = chatMessage && chatMessage.value.trim();
      if (!text) return;
      pushMessage('user', text);
      if (chatMessage) chatMessage.value = '';
      const typing = document.createElement('div');
      typing.className = 'message bot';
      typing.innerHTML = '<div class="bubble">Typing…</div>';
      chatBody?.appendChild(typing);
      chatBody && (chatBody.scrollTop = chatBody.scrollHeight);
      await new Promise(r => setTimeout(r, 500));
      typing.remove();
      pushMessage('bot', answerFor(text));
    });
  });
})();