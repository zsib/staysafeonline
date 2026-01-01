(function(){
  const container = document.getElementById('mdContent');
  const cache = {}; // ts lwk cool
  const btnContainer = document.querySelector('.text-switch');
  const buttons = Array.from(document.querySelectorAll('.text-btn'));

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

  async function loadText(part){ // part as in which part of the text
    setActiveButton(part);
    container.innerHTML = '<p class="loading">Loading…</p>';
    if(cache[part]){
      container.innerHTML = cache[part];
      return;
    }
    const candidates = [
      `content/pl/${part}.md`,
      `content/${part}.md`
    ];
    try{
      const raw = await fetchFirst(candidates);
      const html = marked.parse(raw);
      cache[part] = html;
      container.innerHTML = html;
      // move focus to content for keyboard users
      container.focus && container.focus();
    }catch(err){
      container.innerHTML = `<pre class="error">Error loading content for "${part}": ${err.message}</pre>`;
      console.error(err);
    }
  }

  btnContainer.addEventListener('click', e => {
    const b = e.target.closest('.text-btn');
    if(!b) return;
    const part = b.dataset.lang;
    if(part) loadText(part);
  });


  loadText('1');
  window.loadText = loadText;
})();