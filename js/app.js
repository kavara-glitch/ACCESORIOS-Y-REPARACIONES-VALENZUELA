//--------
let cart = load('val_cart', []);
let favs = load('val_favs', []);
const F = { q: '', cat: '', max: 20, sort: '', favOnly: false };
let selStyle = null, selColor = null;

//--------
function art(cat, c = '#45E7F5', w = 220, h = 150) {
  const base = '#142238';
  const s = {
    cables: `<path d="M30 110c40-70 80 40 120-20s20-40 40-30" stroke="${c}" stroke-width="6" fill="none"/><rect x="16" y="102" width="24" height="18" rx="3" fill="${base}"/><rect x="178" y="46" width="24" height="18" rx="3" fill="${base}"/>`,
    fundas: `<rect x="78" y="16" width="64" height="118" rx="14" fill="${c}" stroke="${base}" stroke-width="3"/><circle cx="96" cy="36" r="9" fill="${base}"/><circle cx="96" cy="36" r="4" fill="#45E7F5"/>`,
    cargadores: `<rect x="80" y="40" width="60" height="64" rx="10" fill="${base}"/><rect x="95" y="20" width="8" height="20" fill="#A7B4C7"/><rect x="117" y="20" width="8" height="20" fill="#A7B4C7"/><rect x="100" y="104" width="20" height="12" fill="${c}"/>`,
    baterias: `<rect x="60" y="34" width="100" height="82" rx="14" fill="${base}"/><rect x="74" y="50" width="72" height="8" rx="4" fill="${c}"/><rect x="74" y="66" width="48" height="8" rx="4" fill="${c}" opacity=".6"/><rect x="74" y="82" width="28" height="8" rx="4" fill="${c}" opacity=".35"/>`,
    protectores: `<rect x="74" y="14" width="72" height="122" rx="12" fill="none" stroke="${base}" stroke-width="4"/><path d="M84 30l30 -10M84 58l40 -24" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`,
    soportes: `<path d="M70 124h80l-14-30h-52z" fill="${base}"/><rect x="92" y="22" width="48" height="76" rx="8" fill="${c}" transform="rotate(12 116 60)"/>`,
    reemplazo: `<rect x="60" y="40" width="100" height="70" rx="10" fill="${base}"/><rect x="160" y="62" width="10" height="26" rx="3" fill="#A7B4C7"/><path d="M104 56v38M92 75h24" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`,
    extras: `<rect x="70" y="40" width="80" height="70" rx="10" fill="${base}"/><circle cx="110" cy="75" r="16" fill="none" stroke="${c}" stroke-width="6"/>`,
    audifonos: `<path d="M58 90V74a52 52 0 0 1 104 0v16" stroke="${base}" stroke-width="8" fill="none"/><rect x="48" y="88" width="22" height="34" rx="9" fill="${c}"/><rect x="150" y="88" width="22" height="34" rx="9" fill="${c}"/>`
  };
  return `<svg viewBox="0 0 220 150" role="img" aria-label="Ilustración de ${CATS[cat]}" width="${w}" height="${h}"><rect width="220" height="150" fill="#e9eff7"/>${s[cat]}</svg>`;
}

//--------
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200);
}

//--------
const cents = n => Math.round(n * 100);

function img(p) {
  return p.img ? `<img src="${p.img}" alt="${p.n}" loading="lazy">` : art(p.c, p.c === 'fundas' ? COLORS[p.cols[0]] : undefined);
}

function card(p, opts = {}) {
  const sels = (p.opts || []).map(([l, v]) =>
    `<label class="sr">${l}<select data-opt="${l}">${v.map(o => `<option>${o}</option>`).join('')}</select></label>`).join('');
  const warn = !p.models && (opts.model || opts.warn) ? '<div class="warn">Compatibilidad sin confirmar: verifica las especificaciones.</div>' : '';
  const stock = p.stock ? `<div class="stock">Disponibilidad: ${p.stock}</div>` : '';
  return `<article class="card ${opts.sel === p.id ? 'sel' : ''}" data-id="${p.id}">
    ${p.real ? '' : '<span class="badge">Demostración</span>'}${img(p)}
    <div class="body"><h3>${p.n}</h3><div class="price">${money(p.p)}</div><p>${p.d}</p>${stock}${sels}${warn}
    <div class="row"><button class="btn pri" data-act="add" data-id="${p.id}">Agregar al carrito</button>
    <button class="btn ghost" data-act="det" data-id="${p.id}">Ver detalles</button>
    <button class="btn ghost fav" data-act="fav" data-id="${p.id}" aria-pressed="${favs.includes(p.id)}" aria-label="Guardar en favoritos">♥</button></div></div></article>`;
}
const empty = msg => `<div class="empty">${msg}</div>`;

function renderCatalog() {
  const list = PRODUCTS.filter(p =>
    (!F.cat || p.c === F.cat) && p.p <= F.max && p.n.toLowerCase().includes(F.q.toLowerCase()));
  if (F.sort === 'name') list.sort((a, b) => a.n.localeCompare(b.n, 'es'));
  else if (F.sort) list.sort((a, b) => F.sort === 'asc' ? a.p - b.p : b.p - a.p);
  const inCat = PRODUCTS.some(p => !F.cat || p.c === F.cat);
  $('#grid').innerHTML = list.length ? list.map(p => card(p)).join('')
    : empty(inCat ? 'No hay productos con esos filtros. Prueba quitar la búsqueda o subir el precio máximo.'
      : `Aún no hay productos registrados en esta categoría. <a href="${waLink(INFO_MSG)}" target="_blank" rel="noopener">Consúltanos por WhatsApp</a>.`);
  $$('#chips .chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.cat === F.cat));
}

function renderFavs() {
  const list = PRODUCTS.filter(p => favs.includes(p.id));
  $('#favGrid').innerHTML = list.length ? list.map(p => card(p)).join('') : empty('Aún no tienes favoritos. Toca ♥ en un producto para guardarlo.');
  $('#favCount').textContent = list.length;
}

function renderFinder(e) {
  if (e) e.preventDefault();
  const d = Object.fromEntries(new FormData($('#finder')));
  const budget = parseFloat(d.budget);
  if (!(budget > 0)) { $('#fResult').innerHTML = empty('Ingresa un presupuesto mayor que cero.'); return; }
  const list = PRODUCTS.filter(p => p.c === d.acc && p.p <= budget &&
    (!d.conn || !p.conn || p.conn === d.conn) &&
    (!d.model || !p.models || p.models.includes(d.model)));
  $('#fResult').innerHTML = list.length ? list.map(p => card(p, { model: d.model, warn: true })).join('') : empty('Sin coincidencias. Aumenta el presupuesto o cambia el tipo de conexión.');
}

function renderStyle() {
  const d = Object.fromEntries(new FormData($('#styler')));
  const list = PRODUCTS.filter(p => p.c === 'fundas' && p.cols && p.p <= parseFloat(d.max || 99) &&
    (!d.color || p.cols.includes(d.color)) && (!d.style || p.style === d.style) &&
    (!d.model || p.models.includes(d.model)));
  $('#sGrid').innerHTML = list.length ? list.map(p => card(p, { sel: selStyle })).join('') : empty('Ninguna funda coincide. Cambia el color, estilo o modelo.');
  const p = byId(selStyle);
  if (!p || !list.includes(p)) { $('#preview').innerHTML = '<p>Selecciona una funda para ver su vista previa, colores y modelos compatibles.</p>'; return; }
  selColor = p.cols.includes(selColor) ? selColor : p.cols[0];
  $('#preview').innerHTML = `${art('fundas', COLORS[selColor])}<h3>${p.n}</h3><div class="price">${money(p.p)}</div>
    <p>Estilo: ${p.style}. Color: ${selColor}</p>
    <div class="swatches">${p.cols.map(c => `<button class="sw" data-act="swatch" data-color="${c}" style="background:${COLORS[c]}" aria-label="${c}" aria-pressed="${c === selColor}"></button>`).join('')}</div>
    <p>Modelos: ${p.models.join(', ')}${p.real ? '' : ' (demostrativo)'}</p>`;
}

function renderBundles() {
  $('#bundles').innerHTML = BUNDLES.map(b => {
    const sum = b.items.reduce((t, id) => t + cents(byId(id).p), 0) / 100;
    return `<article class="card"><span class="badge">Demostración</span><div class="body"><h3>${b.n}</h3>
      <div class="price">${money(b.price)}<s>${money(sum)}</s></div>
      <p>Incluye: ${b.items.map(id => byId(id).n).join(' + ')}.</p><div class="warn">${b.cond}</div>
      <div class="row"><button class="btn pri" data-act="bundle" data-id="${b.id}">Agregar al carrito</button></div></div></article>`;
  }).join('');
}

//--------
const idOf = i => i.key.split('|')[0];
function priceOf(i) {
  const src = byId(idOf(i)) || BUNDLES.find(b => b.id === idOf(i));
  return src ? (src.p ?? src.price) : i.price;
}
function addToCart(key, name, price, opts) {
  const it = cart.find(i => i.key === key);
  if (it) it.qty = Math.min(99, it.qty + 1); else cart.push({ key, name, price, qty: 1, opts });
  saveCart(); toast('Agregado: ' + name);
}
function saveCart() { save('val_cart', cart); renderCart(); }
function cartTotal() { return cart.reduce((t, i) => t + cents(priceOf(i)) * i.qty, 0) / 100; }
function thumb(i) { const p = byId(idOf(i)); return p ? img(p) : art('extras'); }

//--------
function renderCart() {
  $('#cartCount').textContent = cart.reduce((t, i) => t + i.qty, 0);
  $('#cartTotal').textContent = money(cartTotal());
  $('#orderMsg').textContent = '';
  $('#cartItems').innerHTML = cart.length ? cart.map(i => `<div class="line"><span class="thumb">${thumb(i)}</span>
    <div><b>${i.name}</b>${i.opts ? `<small>${i.opts}</small>` : ''}<small>${money(priceOf(i))} c/u</small></div>
    <b>${money(cents(priceOf(i)) * i.qty / 100)}</b>
    <div class="qty"><button data-act="dec" data-key="${i.key}" aria-label="Restar">−</button><span>${i.qty}</span><button data-act="inc" data-key="${i.key}" aria-label="Sumar">+</button></div>
    <button class="link" data-act="del" data-key="${i.key}">Eliminar producto</button></div>`).join('')
    : `<div class="empty">Tu carrito está vacío. Explora los accesorios y agrega lo que necesites.<br><br><a class="btn pri" href="#catalogo" data-act="close-cart">Explorar accesorios</a></div>`;
}
function openCart(open) {
  $('#drawer').classList.toggle('open', open);
  $('#drawer').setAttribute('aria-hidden', !open);
  $('#scrim').hidden = !open;
}
function showDialog(html) { $('#dlgBody').innerHTML = html; $('#dlg').showModal(); }

function details(p) {
  showDialog(`${img(p)}<h2>${p.n}</h2><p class="price">${money(p.p)}</p><p>${p.d}</p>
    <p><b>Categoría:</b> ${CATS[p.c]}</p>
    ${p.conn ? `<p><b>Conexión:</b> ${p.conn}</p>` : ''}${p.spec ? `<p><b>Detalles:</b> ${p.spec}</p>` : ''}
    ${p.stock ? `<p><b>Disponibilidad:</b> ${p.stock}</p>` : ''}
    <p><b>Compatibilidad:</b> ${p.models ? p.models.join(', ') + (p.real ? '' : ' (demostrativo)') : 'sin confirmar'}</p>
    <p class="note">${p.real ? 'Precio y disponibilidad sujetos a confirmación del negocio.' : 'Datos de demostración: el negocio debe confirmar precio, compatibilidad y disponibilidad.'}</p>`);
}

//--------
function orderMessage(note) {
  const lines = cart.map(i => `- ${i.name}${i.opts ? ' (' + i.opts + ')' : ''} x ${i.qty} — ${money(priceOf(i))} c/u — Subtotal: ${money(cents(priceOf(i)) * i.qty / 100)}.`);
  return ['Hola, ' + BUSINESS.name + '. 👋', '', 'Quisiera consultar y realizar el siguiente pedido:', '', ...lines, '',
    'Total estimado: ' + money(cartTotal()) + '.', ...(note ? ['', 'Comentarios: ' + note] : []), '',
    '¿Podrían confirmarme la disponibilidad de estos productos y el precio final?', '', 'Gracias.'].join('\n');
}
function openWhatsApp(text) { window.open(waLink(text), '_blank', 'noopener'); }
function sendOrder() {
  if (!cart.length) { $('#orderMsg').textContent = 'Tu carrito está vacío. Agrega al menos un producto para hacer el pedido.'; return; }
  $('#orderMsg').textContent = '';
  openWhatsApp(orderMessage($('#orderNote').value.trim()));
}
function serviceMessage(id) {
  const s = SERVICES.find(x => x.id === id);
  return ['Hola, ' + BUSINESS.name + '. 👋', '', 'Quisiera consultar si ofrecen el servicio: ' + s.n + '.', '',
    '¿Podrían indicarme si está disponible, el precio y el tiempo estimado?', '', 'Gracias.'].join('\n');
}

//--------
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act],.chip,.cat,.card');
  if (!b) return;
  const act = b.dataset.act, id = b.dataset.id, key = b.dataset.key;
  if (b.classList.contains('chip') || b.classList.contains('cat')) {
    F.cat = b.dataset.cat; renderCatalog(); $('#catalogo').scrollIntoView(); return;
  }
  const item = () => cart.find(i => i.key === key);
  if (act === 'add') {
    const p = byId(id), c = b.closest('.card');
    const o = $$('select[data-opt]', c).map(s => `${s.dataset.opt}: ${s.value}`).join(' · ');
    addToCart(id + '|' + o, p.n, p.p, o);
  } else if (act === 'bundle') {
    const bd = BUNDLES.find(x => x.id === id); addToCart(bd.id, bd.n, bd.price, 'Paquete');
  } else if (act === 'fav') {
    favs = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
    save('val_favs', favs); toast(favs.includes(id) ? 'Guardado en favoritos' : 'Quitado de favoritos');
    renderAll();
  } else if (act === 'det') details(byId(id));
  else if (act === 'inc') { const i = item(); i.qty = Math.min(99, i.qty + 1); saveCart(); }
  else if (act === 'dec') { const i = item(); if (--i.qty < 1) cart = cart.filter(x => x !== i); saveCart(); }
  else if (act === 'del') { cart = cart.filter(i => i.key !== key); saveCart(); toast('Producto eliminado'); }
  else if (act === 'clear') { cart = []; saveCart(); toast('Carrito vacío'); }
  else if (act === 'order') sendOrder();
  else if (act === 'svc') openWhatsApp(serviceMessage(id));
  else if (act === 'go-favs') $('#favoritos').scrollIntoView();
  else if (act === 'close-cart') openCart(false);
  else if (act === 'swatch') { selColor = b.dataset.color; renderStyle(); }
  else if (b.classList.contains('card') && b.closest('#sGrid') && !e.target.closest('button,select')) {
    selStyle = b.dataset.id; selColor = null; renderStyle();
  }
});

function renderAll() { renderCatalog(); renderFavs(); renderFinder(); renderStyle(); }

//--------
let repairText = '';
const hideRepair = () => { repairText = ''; ['#rPreview', '#rOpen', '#rNote'].forEach(s => $(s).hidden = true); };

function repairMessage(d) {
  return ['Hola, ' + BUSINESS.name + '. 👋', '', 'Quisiera consultar sobre una posible reparación.', '',
    'Nombre: ' + d.nombre + '.', '', 'Dispositivo: ' + d.tipo + '.', '', 'Marca: ' + d.marca + '.', '', 'Modelo: ' + d.modelo + '.', '',
    'Problema: ' + d.problema + '.', '', 'Servicio solicitado: ' + d.servicio + '.', '',
    'Comentarios adicionales: ' + (d.comentarios || 'Ninguno') + '.', '',
    '¿Podrían indicarme si es posible revisar mi dispositivo y proporcionarme información sobre el precio y el tiempo estimado?', '', 'Gracias.'].join('\n');
}

function validateRepair(e) {
  e.preventDefault();
  const d = Object.fromEntries([...new FormData(e.target)].map(([k, v]) => [k, v.trim()]));
  const errs = {
    nombre: d.nombre.length < 2 ? 'Escribe tu nombre.' : '',
    tipo: d.tipo ? '' : 'Elige el tipo de dispositivo.',
    marca: d.marca.length < 2 ? 'Escribe la marca del dispositivo.' : '',
    modelo: d.modelo ? '' : 'Escribe el modelo del dispositivo.',
    problema: d.problema.length < 10 ? 'Describe el problema (mínimo 10 caracteres).' : '',
    servicio: d.servicio ? '' : 'Elige el servicio que deseas consultar.'
  };
  $$('.err', e.target).forEach(s => s.textContent = errs[s.dataset.for]);
  if (Object.values(errs).some(Boolean)) { hideRepair(); return; }
  repairText = repairMessage(d);
  $('#rPreview').textContent = repairText;
  ['#rPreview', '#rOpen', '#rNote'].forEach(s => $(s).hidden = false);
}

//--------
function init() {
  const strip = svg => svg.replace(/<svg[^>]*>|<\/svg>|<rect width="220" height="150" fill="#e9eff7"\/>/g, '');
  $('#heroArt').innerHTML = `<svg viewBox="0 0 440 300"><rect width="440" height="300" rx="14" fill="#e9eff7"/>
    <g transform="translate(10 10) scale(.9)">${strip(art('cargadores'))}</g>
    <g transform="translate(180 20) scale(1.1)">${strip(art('fundas', '#45E7F5'))}</g>
    <g transform="translate(60 150) scale(1.2)">${strip(art('cables'))}</g></svg>`;
  const count = k => PRODUCTS.filter(p => p.c === k).length;
  $('#cats').innerHTML = Object.entries(CATS).map(([k, v]) =>
    `<button class="cat" data-cat="${k}"><span class="circ">${art(k)}</span><span class="nm">${v}</span><small>${count(k)} ${count(k) === 1 ? 'producto' : 'productos'}</small></button>`).join('');
  $('#chips').innerHTML = `<button class="chip" data-cat="">Todas</button>` + Object.entries(CATS).map(([k, v]) => `<button class="chip" data-cat="${k}">${v}</button>`).join('');
  $('#fAcc').innerHTML = Object.entries(CATS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
  const opts = a => a.map(o => `<option>${o}</option>`).join('');
  $('#fModel').insertAdjacentHTML('beforeend', opts(MODELS));
  $('#sModel').insertAdjacentHTML('beforeend', opts(MODELS));
  $('#sColor').insertAdjacentHTML('beforeend', opts(Object.keys(COLORS)));
  $('#rService').insertAdjacentHTML('beforeend', opts(SERVICES.map(s => s.n)));
  $('#services').innerHTML = SERVICES.map(s => `<article class="svc"><span class="pend">Pendiente de confirmación</span><h3>${s.n}</h3><p>${s.d}</p>
    <p class="mini">Precio, tiempo y dispositivos atendidos: a confirmar por el negocio.</p>
    <button class="btn wa" data-act="svc" data-id="${s.id}">Consultar reparación por WhatsApp</button></article>`).join('');
  $$('[data-wa]').forEach(a => a.href = waLink(INFO_MSG));

  $('#q').addEventListener('input', e => { F.q = e.target.value.trim(); renderCatalog(); });
  $('#q').addEventListener('keydown', e => { if (e.key === 'Enter') $('#catalogo').scrollIntoView(); });
  $('#max').addEventListener('input', e => { F.max = +e.target.value; $('#maxOut').textContent = money(F.max); renderCatalog(); });
  $('#sort').addEventListener('change', e => { F.sort = e.target.value; renderCatalog(); });
  $('#finder').addEventListener('submit', renderFinder);
  $('#styler').addEventListener('input', renderStyle);
  $('#cartBtn').addEventListener('click', () => openCart(true));
  $('#scrim').addEventListener('click', () => openCart(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') openCart(false); });
  $('#menuBtn').addEventListener('click', e => {
    const open = $('#nav').classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', open);
  });
  $$('#nav a').forEach(a => a.addEventListener('click', () => $('#nav').classList.remove('open')));
  $('#rform').addEventListener('submit', validateRepair);
  $('#rform').addEventListener('input', hideRepair);
  $('#rOpen').addEventListener('click', () => { if (repairText) openWhatsApp(repairText); });

  renderBundles(); renderAll(); renderCart();
}

//--------
init();
