const form = $('#pform');
let editing = null, image = '', catEditing = null;

//--------
const sha256 = s => {
  const rr = (v, a) => (v >>> a) | (v << (32 - a)), mp = Math.pow, mw = mp(2, 32);
  let result = '', words = [], hash = [], k = [], pc = 0;
  const comp = {};
  s = unescape(encodeURIComponent(s));
  const bits = s.length * 8;
  for (let c = 2; pc < 64; c++) {
    if (!comp[c]) {
      for (let i = 0; i < 313; i += c) comp[i] = c;
      hash[pc] = (mp(c, .5) * mw) | 0; k[pc++] = (mp(c, 1 / 3) * mw) | 0;
    }
  }
  s += '\x80';
  while (s.length % 64 - 56) s += '\x00';
  for (let i = 0; i < s.length; i++) words[i >> 2] |= s.charCodeAt(i) << ((3 - i) % 4) * 8;
  words[words.length] = (bits / mw) | 0; words[words.length] = bits;
  for (let j = 0; j < words.length;) {
    const w = words.slice(j, j += 16), old = hash;
    hash = hash.slice(0, 8);
    for (let i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2], a = hash[0], e = hash[4];
      const t1 = hash[7] + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & hash[5]) ^ (~e & hash[6])) + k[i]
        + (w[i] = i < 16 ? w[i] : (w[i - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0);
      const t2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(t1 + t2) | 0].concat(hash); hash[4] = (hash[4] + t1) | 0;
    }
    for (let i = 0; i < 8; i++) hash[i] = (hash[i] + old[i]) | 0;
  }
  for (let i = 0; i < 8; i++) for (let j = 3; j + 1; j--) { const b = (hash[i] >> (j * 8)) & 255; result += (b < 16 ? 0 : '') + b.toString(16); }
  return result;
};

//--------
const pwRec = () => load('val_pw', null);
function hashPw(pw, salt) { let h = salt + pw; for (let i = 0; i < 1000; i++) h = sha256(h + salt + pw); return h; }
function randSalt() {
  try { return [...crypto.getRandomValues(new Uint8Array(12))].map(b => b.toString(16).padStart(2, '0')).join(''); }
  catch { return Math.random().toString(16).slice(2) + Date.now().toString(16); }
}
function setPw(pw) {
  const salt = randSalt();
  try { localStorage.setItem('val_pw', JSON.stringify({ salt, hash: hashPw(pw, salt) })); return true; } catch { return false; }
}
const checkPw = pw => { const r = pwRec(); return !!r && hashPw(pw, r.salt) === r.hash; };
const isLogged = () => { try { return !!pwRec() && sessionStorage.getItem('val_session') === '1'; } catch { return false; } };
const startSession = () => { try { sessionStorage.setItem('val_session', '1'); } catch {} };

function show() {
  const ok = isLogged(), has = !!pwRec();
  $('#gate').hidden = ok; $('#setup').hidden = has; $('#login').hidden = !has;
  $('#panel').hidden = !ok; $('#logout').hidden = !ok;
  if (!ok) return;
  loadCatalog(); refreshAll(); resetForm();
}

//--------
const NORM = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const slug = s => NORM(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || 'cat';
const countIn = id => ALL.filter(p => p.c === id).length;

function commit() {
  try { localStorage.setItem('val_catalog', JSON.stringify({ v: Date.now(), categories: catList(), products: ALL })); return true; }
  catch { alert('No se pudo guardar: el espacio del navegador está lleno. Usa imágenes más pequeñas o elimina productos.'); return false; }
}

function pubStatus() {
  const w = load('val_catalog', null), pending = w && w.v > CATALOGO.v;
  $('#pubStatus').textContent = pending ? 'Tienes cambios sin publicar: los clientes todavía no los ven.' : 'No hay cambios pendientes de publicar.';
}

function exportCatalog() {
  const w = load('val_catalog', null) || { v: CATALOGO.v || Date.now(), categories: catList(), products: ALL };
  const blob = new Blob(['const CATALOGO = ' + JSON.stringify(w, null, 1) + ';\n'], { type: 'text/javascript' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'catalogo.js'; a.click();
}

//--------
function renderCatSelect() {
  const cur = $('#fc').value;
  $('#fc').innerHTML = Object.entries(CATS).map(([k, v]) => `<option value="${esc(k)}">${esc(v)}</option>`).join('');
  if (CATS[cur]) $('#fc').value = cur;
  toggleFields();
}

function renderCats() {
  $('#catRows').innerHTML = Object.entries(CATS).map(([id, name]) => `<tr><td>${esc(name)}</td><td>${countIn(id)}</td>
    <td class="acts"><button class="link" data-cact="edit" data-id="${esc(id)}">Editar</button>
    <button class="link" data-cact="del" data-id="${esc(id)}">Eliminar</button></td></tr>`).join('')
    || '<tr><td colspan="3">No hay categorías. Agrega la primera.</td></tr>';
}

function renderRows() {
  $('#rows').innerHTML = ALL.map(p => `<tr><td>${safeImg(p.img) ? `<img class="th" src="${esc(safeImg(p.img))}" alt="">` : '—'}</td>
    <td>${esc(p.n)}</td><td>${esc(p.modelo || '—')}</td><td>${esc(CATS[p.c] || '—')}</td><td>${money(p.p)}</td><td>${p.off ? 'Oculto' : 'Visible'}</td>
    <td class="acts"><button class="link" data-act="edit" data-id="${esc(p.id)}">Editar</button>
    <button class="link" data-act="toggle" data-id="${esc(p.id)}">${p.off ? 'Mostrar' : 'Ocultar'}</button>
    <button class="link" data-act="del" data-id="${esc(p.id)}">Eliminar</button></td></tr>`).join('')
    || '<tr><td colspan="7">Aún no hay productos. Agrega el primero con el formulario.</td></tr>';
}

function refreshAll() { renderCats(); renderCatSelect(); renderRows(); pubStatus(); }

//--------
function catMsg(text, ok) { const m = $('#catMsg'); m.textContent = text; m.className = ok ? 'ok' : 'err'; }
function resetCatForm() { catEditing = null; $('#catForm').reset(); $('#catSave').textContent = 'Agregar categoría'; $('#catCancel').hidden = true; }

$('#catForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = e.target.elements.name.value.trim();
  if (name.length < 2 || name.length > 40) return catMsg('El nombre debe tener entre 2 y 40 caracteres.', false);
  const dup = Object.entries(CATS).some(([id, n]) => id !== catEditing && NORM(n) === NORM(name));
  if (dup) return catMsg('Ya existe una categoría con ese nombre.', false);
  if (catEditing) { CATS[catEditing] = name; catMsg('Categoría actualizada.', true); }
  else {
    let id = slug(name);
    if (CATS[id]) id += '-' + Date.now().toString(36);
    CATS[id] = name; catMsg('Categoría agregada.', true);
  }
  commit(); resetCatForm(); refreshAll();
});
$('#catCancel').addEventListener('click', () => { resetCatForm(); catMsg('', true); });

$('#catRows').addEventListener('click', e => {
  const b = e.target.closest('[data-cact]');
  if (!b) return;
  const id = b.dataset.id, name = CATS[id];
  if (b.dataset.cact === 'edit') {
    catEditing = id; $('#catForm').elements.name.value = name;
    $('#catSave').textContent = 'Guardar cambios'; $('#catCancel').hidden = false; catMsg('', true);
    $('#catForm').elements.name.focus();
  } else {
    const n = countIn(id);
    if (n > 0) return catMsg(`No se puede eliminar «${name}»: tiene ${n} producto${n === 1 ? '' : 's'}. Mueve o elimina esos productos primero.`, false);
    if (!confirm('¿Eliminar la categoría "' + name + '"?')) return;
    delete CATS[id]; if (catEditing === id) resetCatForm();
    commit(); catMsg('Categoría eliminada.', true); refreshAll();
  }
});

//--------
const special = () => ['fundas', 'protectores'].includes(form.elements.c.value) ? form.elements.c.value : 'other';
function toggleFields() { $$('[data-show]').forEach(el => el.hidden = !el.dataset.show.split(',').includes(special())); }
function showPreview() {
  const u = safeImg(image);
  $('#imgPrev').innerHTML = u ? `<img src="${esc(u)}" alt="Vista previa de la imagen">` : 'Sin imagen';
}

function resetForm() {
  editing = null; image = ''; form.reset(); renderCatSelect(); showPreview();
  $('#formTitle').textContent = 'Agregar producto'; $('#perr').textContent = '';
}

function fillForm(p) {
  const v = form.elements;
  editing = p.id; image = p.img || ''; $('#formTitle').textContent = 'Editar producto';
  v.n.value = p.n; v.p.value = p.p; v.c.value = p.c; v.conn.value = p.conn || ''; v.modelo.value = p.modelo || '';
  v.d.value = p.d; v.style.value = p.style || 'minimalista'; v.off.checked = !!p.off; v.destacado.checked = !!p.destacado;
  v.stock.value = p.stock || ''; v.modelos.value = (p.models || []).join(', ');
  $$('input[name=col]').forEach(i => i.checked = (p.cols || []).includes(i.value));
  showPreview(); toggleFields(); form.scrollIntoView();
}

function loadImage(file) {
  if (!file) return;
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { $('#perr').textContent = 'La imagen debe ser JPG, PNG o WebP.'; return; }
  const r = new FileReader();
  r.onload = () => {
    const im = new Image();
    im.onload = () => {
      const s = Math.min(1, 500 / im.width), c = document.createElement('canvas');
      c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      image = c.toDataURL('image/jpeg', 0.75); showPreview();
    };
    im.onerror = () => { $('#perr').textContent = 'No se pudo leer la imagen.'; };
    im.src = r.result;
  };
  r.readAsDataURL(file);
}

function readForm() {
  const v = form.elements, cols = $$('input[name=col]:checked').map(i => i.value);
  const models = [...new Set(v.modelos.value.split(',').map(s => s.trim()).filter(Boolean))];
  const p = { id: editing || 'p' + Date.now(), n: v.n.value.trim(), p: Math.round(parseFloat(v.p.value) * 100) / 100, c: v.c.value, d: v.d.value.trim() };
  if (v.conn.value) p.conn = v.conn.value;
  if (v.stock.value) p.stock = v.stock.value;
  if (v.off.checked) p.off = true;
  if (v.destacado.checked) p.destacado = true;
  if (image) p.img = image;
  if (special() === 'other' && v.modelo.value.trim()) p.modelo = v.modelo.value.trim();
  if (p.c === 'fundas') { p.style = v.style.value; p.cols = cols; p.models = models; }
  else if (p.c === 'protectores' && models.length) p.models = models;
  return { p, cols, models };
}

function validate({ p, cols, models }) {
  if (!CATS[p.c]) return 'Primero agrega una categoría y elígela.';
  if (p.n.length < 3) return 'El nombre debe tener al menos 3 letras.';
  if (!(p.p > 0) || p.p >= 100000) return 'Escribe un precio válido mayor que cero.';
  if (p.d.length < 5) return 'Escribe una descripción breve.';
  if (p.c === 'fundas' && (!cols.length || !models.length)) return 'Las fundas necesitan al menos un color y un modelo.';
  if (models.some(m => m.length > 40)) return 'Cada modelo debe tener máximo 40 caracteres.';
  return '';
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const r = readForm(), err = validate(r);
  $('#perr').textContent = err;
  if (err) return;
  const i = ALL.findIndex(x => x.id === r.p.id);
  if (i >= 0) ALL[i] = r.p; else ALL.push(r.p);
  setProducts(ALL); commit(); refreshAll(); resetForm();
});
form.elements.c.addEventListener('change', toggleFields);
$('#file').addEventListener('change', e => loadImage(e.target.files[0]));
$('#noImg').addEventListener('click', () => { image = ''; $('#file').value = ''; showPreview(); });
$('#cancel').addEventListener('click', resetForm);

$('#rows').addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const p = ALL.find(x => x.id === b.dataset.id);
  if (b.dataset.act === 'edit') fillForm(p);
  else if (b.dataset.act === 'toggle') { if (p.off) delete p.off; else p.off = true; setProducts(ALL); commit(); refreshAll(); }
  else if (b.dataset.act === 'del' && confirm('¿Eliminar "' + p.n + '"?')) { ALL.splice(ALL.indexOf(p), 1); setProducts(ALL); commit(); refreshAll(); }
});
$('#export').addEventListener('click', exportCatalog);

//--------
$('#setup').addEventListener('submit', e => {
  e.preventDefault();
  const v = e.target.elements, err = $('#setupErr');
  err.textContent = v.pw.value.length < 8 ? 'La contraseña debe tener al menos 8 caracteres.' : v.pw.value !== v.pw2.value ? 'Las contraseñas no coinciden.' : '';
  if (err.textContent) return;
  if (!setPw(v.pw.value)) { err.textContent = 'No se pudo guardar la contraseña en este navegador.'; return; }
  e.target.reset(); startSession(); show();
});
$('#login').addEventListener('submit', e => {
  e.preventDefault();
  if (checkPw($('#pass').value)) { $('#loginErr').textContent = ''; $('#pass').value = ''; startSession(); show(); }
  else $('#loginErr').textContent = 'Contraseña incorrecta.';
});
$('#showPass').addEventListener('change', e => $('#pass').type = e.target.checked ? 'text' : 'password');
$('#forgot').addEventListener('click', () => {
  if (!confirm('Se borrará la contraseña actual y podrás crear una nueva. Tus productos y categorías no se borran.')) return;
  try { localStorage.removeItem('val_pw'); sessionStorage.removeItem('val_session'); } catch {}
  show();
});
$('#logout').addEventListener('click', () => { try { sessionStorage.removeItem('val_session'); } catch {} show(); });

$('#pwForm').addEventListener('submit', e => {
  e.preventDefault();
  const v = e.target.elements;
  const msg = !checkPw(v.cur.value) ? 'La contraseña actual no coincide.'
    : v.nw.value.length < 8 ? 'La nueva contraseña debe tener al menos 8 caracteres.'
    : v.nw.value !== v.nw2.value ? 'Las contraseñas nuevas no coinciden.' : '';
  $('#pwMsg').textContent = msg;
  if (msg) return;
  if (!setPw(v.nw.value)) { $('#pwMsg').textContent = 'No se pudo guardar la contraseña.'; return; }
  e.target.reset(); $('#pwMsg').textContent = 'Contraseña actualizada.';
});

//--------
$('#fcols').innerHTML = Object.keys(COLORS).map(c => `<label class="chk"><input type="checkbox" name="col" value="${c}"> ${c}</label>`).join('');
loadCatalog();
show();
