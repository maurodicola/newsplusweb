/* Avviso per chi apre news+ web dal browser interno di Facebook o Instagram,
   che blocca alcune dirette TV: propone di aprire la pagina nel browser abituale. */
(function () {
  var ua = navigator.userAgent || '';
  if (!/FBAN|FBAV|FB_IAB|FBIOS|FB4A|Instagram/i.test(ua)) return;

  var KEY = 'npw-inapp-chiuso';
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}

  var isAndroid = /Android/i.test(ua);
  var isIOS = /iPhone|iPad|iPod/i.test(ua);
  var app = /Instagram/i.test(ua) ? 'Instagram' : 'Facebook';
  var url = location.href;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  var bar = el('div', 'inapp-bar');
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Avviso sul browser');

  var msg = el('p', 'inapp-msg');
  msg.appendChild(el('strong', null, 'Stai usando il browser interno di ' + app + '.'));
  msg.appendChild(document.createTextNode(' Alcune dirette TV potrebbero non funzionare: per un’esperienza completa apri news+ web nel tuo browser abituale.'));
  bar.appendChild(msg);

  var actions = el('div', 'inapp-actions');

  if (isAndroid) {
    var open = el('a', 'inapp-btn', 'Apri nel browser');
    open.href = 'intent://' + url.replace(/^https?:\/\//, '') +
      '#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end';
    actions.appendChild(open);
  } else if (isIOS) {
    var safari = el('a', 'inapp-btn', 'Apri in Safari');
    safari.href = 'x-safari-' + url;
    actions.appendChild(safari);
  }

  var copy = el('button', 'inapp-btn inapp-btn-alt', 'Copia link');
  copy.type = 'button';
  copy.addEventListener('click', function () {
    function done() { copy.textContent = 'Link copiato!'; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var t = document.createElement('textarea');
      t.value = url; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      document.body.removeChild(t);
    }
  });
  actions.appendChild(copy);
  bar.appendChild(actions);

  if (isIOS) {
    bar.appendChild(el('p', 'inapp-hint', 'Se il pulsante non funziona: tocca ⋯ in alto a destra e scegli “Apri nel browser esterno”.'));
  } else if (!isAndroid) {
    bar.appendChild(el('p', 'inapp-hint', 'In alternativa: apri il menu ⋯ e scegli “Apri nel browser”.'));
  }

  var close = el('button', 'inapp-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', 'Chiudi avviso');
  close.addEventListener('click', function () {
    bar.remove();
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
  });
  bar.appendChild(close);

  function show() { document.body.insertBefore(bar, document.body.firstChild); }
  if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
})();
