(function(){
  const container = document.getElementById('mdContent');
  const cache = {};
  const btnContainer = document.querySelector('.lang-switch');
  const buttons = Array.from(document.querySelectorAll('.lang-btn'));
  function setActiveButton(lang){
    buttons.forEach(b => {
      const is = b.dataset.lang === lang;
      b.classList.toggle('active', is);
      b.setAttribute('aria-selected', is ? 'true' : 'false');
    });
  }
  async function fetchFirst(urls){
    for(const u of urls){
      try{
        const res = await fetch(u);
        if(res.ok) return await res.text();
      }catch(e){
        // continue
      }
    }
    throw new Error('No content file found');
  }
  async function loadLang(lang){
    setActiveButton(lang);
    container.innerHTML = '<p class="loading">Loading…</p>';
    if(cache[lang]){
      container.innerHTML = cache[lang];
      return;
    }
    const candidates = [
      `content/${lang}/${lang}.md`,
      `content/${lang}/index.md`,
      `content/${lang}.md`
    ];
    try{
      const raw = await fetchFirst(candidates);
      const html = marked.parse(raw);
      cache[lang] = html;
      container.innerHTML = html;
      // move focus to content for keyboard users
      container.focus && container.focus();
    }catch(err){
      container.innerHTML = `<pre class="error">Error loading content for "${lang}": ${err.message}</pre>`;
      console.error(err);
    }
  }
  btnContainer.addEventListener('click', e => {
    const b = e.target.closest('.lang-btn');
    if(!b) return;
    const lang = b.dataset.lang;
    if(lang) loadLang(lang);
  });
  loadLang('pl');
  window.loadLang = loadLang;
})();