const DEFAULT_ADMIN = { user: 'admin', pass: 'valenzuela2026' };
const account = () => load('val_admin', null) || DEFAULT_ADMIN;
const MODELO_CATS = ['cables', 'cargadores', 'baterias', 'reemplazo', 'audifonos', 'soportes', 'extras'];
const form = $('#pform');
let editing = null, image = '';

//--------
function isLogged() { try { return sessionStorage.getItem('val_session') === '1'; } catch { return false; } }
function show() {
  const ok = isLogged();
  $('#gate').hidden = ok; $('#panel').hidden = !ok; $('#logout').hidden = !ok;
  if (ok) { $('#who').textContent = account().user; renderRows(); toggleFields(); }
}

//--------
function persist() {
  try { localStorage.setItem('val_products', JSON.stringify(ALL)); }
  catch { alert('No se pudo guardar: el espacio del navegador está lleno. Usa imágenes más pequeñas o elimina productos.'); }
  renderRows();
}

function renderRows() {
  $('#rows').innerHTML = ALL.map(p => `<tr><td>${p.img ? `<img class="th" src="${p.img}" alt="">` : '—'}</td>
    <td>${p.n}</td><td>${p.modelo || '—'}</td><td>${CATS[p.c]}</td><td>${money(p.p)}</td><td>${p.off ? 'Oculto' : 'Visible'}</td>
    <td class="acts"><button class="link" data-act="edit" data-id="${p.id}">Editar</button>
    <button class="link" data-act="toggle" data-id="${p.id}">${p.off ? 'Mostrar' : 'Ocultar'}</button>
    <button class="link" data-act="del" data-id="${p.id}">Eliminar</button></td></tr>`).join('')
    || '<tr><td colspan="7">No hay productos. Agrega el primero con el formulario.</td></tr>';
}

function toggleFields() {
  $$('[data-show]').forEach(el => el.hidden = !el.dataset.show.split(',').includes(form.elements.c.value));
}
function showPreview() { $('#imgPrev').innerHTML = image ? `<img src="${image}" alt="Vista previa de la imagen">` : 'Sin imagen'; }

function resetForm() {
  editing = null; image = ''; form.reset(); showPreview(); toggleFields();
  $('#formTitle').textContent = 'Agregar producto'; $('#perr').textContent = '';
}

function fillForm(p) {
  const v = form.elements;
  editing = p.id; image = p.img || ''; $('#formTitle').textContent = 'Editar producto';
  v.n.value = p.n; v.p.value = p.p; v.c.value = p.c; v.conn.value = p.conn || ''; v.modelo.value = p.modelo || '';
  v.d.value = p.d; v.style.value = p.style || 'minimalista'; v.off.checked = !!p.off; v.stock.value = p.stock || '';
  $$('input[name=col]').forEach(i => i.checked = (p.cols || []).includes(i.value));
  $$('input[name=mod]').forEach(i => i.checked = (p.models || []).includes(i.value));
  showPreview(); toggleFields(); form.scrollIntoView();
}

//--------
function loadImage(file) {
  if (!file) return;
  if (!file.type.startsWith('image/')) { $('#perr').textContent = 'El archivo debe ser una imagen.'; return; }
  const r = new FileReader();
  r.onload = () => {
    const im = new Image();
    im.onload = () => {
      const s = Math.min(1, 600 / im.width), c = document.createElement('canvas');
      c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      image = c.toDataURL('image/jpeg', 0.8); showPreview();
    };
    im.onerror = () => { $('#perr').textContent = 'No se pudo leer la imagen.'; };
    im.src = r.result;
  };
  r.readAsDataURL(file);
}

function readForm() {
  const v = form.elements, cols = $$('input[name=col]:checked').map(i => i.value), models = $$('input[name=mod]:checked').map(i => i.value);
  const p = { id: editing || 'p' + Date.now(), n: v.n.value.trim(), p: Math.round(parseFloat(v.p.value) * 100) / 100, c: v.c.value, d: v.d.value.trim(), real: true };
  if (v.conn.value) p.conn = v.conn.value;
  if (v.stock.value) p.stock = v.stock.value;
  if (v.off.checked) p.off = true;
  if (image) p.img = image;
  if (MODELO_CATS.includes(p.c) && v.modelo.value.trim()) p.modelo = v.modelo.value.trim();
  if (p.c === 'fundas') { p.style = v.style.value; p.cols = cols; p.models = models; p.opts = [['Color', cols], ['Modelo', models]]; }
  else if (p.c === 'protectores' && models.length) { p.models = models; p.opts = [['Modelo', models]]; }
  return { p, cols, models };
}

function validate({ p, cols, models }) {
  if (p.n.length < 3) return 'El nombre debe tener al menos 3 letras.';
  if (!(p.p > 0)) return 'Escribe un precio mayor que cero.';
  if (p.d.length < 5) return 'Escribe una descripción breve.';
  if (p.c === 'fundas' && (!cols.length || !models.length)) return 'Las fundas necesitan al menos un color y un modelo.';
  return '';
}

//--------
form.addEventListener('submit', e => {
  e.preventDefault();
  const r = readForm(), err = validate(r);
  $('#perr').textContent = err;
  if (err) return;
  const i = ALL.findIndex(x => x.id === r.p.id);
  if (i >= 0) ALL[i] = r.p; else ALL.push(r.p);
  persist(); resetForm();
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
  else if (b.dataset.act === 'toggle') { p.off = !p.off; if (!p.off) delete p.off; persist(); }
  else if (b.dataset.act === 'del') {
    if (BUNDLES.some(x => x.items.includes(p.id))) { alert('Este producto forma parte de un paquete de oferta. Ocúltalo en lugar de eliminarlo.'); return; }
    if (confirm('¿Eliminar "' + p.n + '"?')) { ALL.splice(ALL.indexOf(p), 1); persist(); }
  }
});

$('#reset').addEventListener('click', () => {
  if (!confirm('Se perderán los cambios y volverán los productos de ejemplo.')) return;
  try { localStorage.removeItem('val_products'); } catch {}
  location.reload();
});

//--------
$('#login').addEventListener('submit', e => {
  e.preventDefault();
  const a = account();
  if ($('#user').value.trim() === a.user && $('#pass').value === a.pass) {
    try { sessionStorage.setItem('val_session', '1'); } catch {}
    $('#loginErr').textContent = ''; $('#pass').value = ''; show();
  } else $('#loginErr').textContent = 'Usuario o contraseña incorrectos.';
});
$('#showPass').addEventListener('change', e => $('#pass').type = e.target.checked ? 'text' : 'password');
$('#logout').addEventListener('click', () => { try { sessionStorage.removeItem('val_session'); } catch {} show(); });

$('#pwForm').addEventListener('submit', e => {
  e.preventDefault();
  const v = e.target.elements, a = account();
  const msg = v.cur.value !== a.pass ? 'La contraseña actual no coincide.'
    : v.nw.value.length < 6 ? 'La nueva contraseña debe tener al menos 6 caracteres.'
    : v.nw.value !== v.nw2.value ? 'Las contraseñas nuevas no coinciden.' : '';
  $('#pwMsg').textContent = msg;
  if (msg) return;
  save('val_admin', { user: a.user, pass: v.nw.value });
  e.target.reset(); $('#pwMsg').textContent = 'Contraseña actualizada en este navegador.';
});

//--------
$('#fc').innerHTML = Object.entries(CATS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
$('#fcols').innerHTML = Object.keys(COLORS).map(c => `<label class="chk"><input type="checkbox" name="col" value="${c}"> ${c}</label>`).join('');
$('#fmodels').innerHTML = MODELS.map(m => `<label class="chk"><input type="checkbox" name="mod" value="${m}"> ${m}</label>`).join('');
show();
