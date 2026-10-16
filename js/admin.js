const PASS = 'valenzuela2026';
const form = $('#pform');
let editing = null;

//--------
function isLogged() { try { return sessionStorage.getItem('val_admin') === '1'; } catch { return false; } }
function show() {
  const ok = isLogged();
  $('#gate').hidden = ok; $('#panel').hidden = !ok; $('#logout').hidden = !ok;
  if (ok) renderRows();
}

//--------
function persist() { save('val_products', ALL); renderRows(); }

function renderRows() {
  $('#rows').innerHTML = ALL.map(p => `<tr><td>${p.n}</td><td>${CATS[p.c]}</td><td>${money(p.p)}</td>
    <td>${p.off ? 'Oculto' : 'Visible'}</td>
    <td class="acts"><button class="link" data-act="edit" data-id="${p.id}">Editar</button>
    <button class="link" data-act="toggle" data-id="${p.id}">${p.off ? 'Mostrar' : 'Ocultar'}</button>
    <button class="link" data-act="del" data-id="${p.id}">Eliminar</button></td></tr>`).join('')
    || '<tr><td colspan="5">No hay productos. Agrega el primero con el formulario.</td></tr>';
}

function resetForm() {
  editing = null; form.reset();
  $('#formTitle').textContent = 'Agregar producto'; $('#perr').textContent = '';
}

function fillForm(p) {
  editing = p.id; $('#formTitle').textContent = 'Editar producto';
  form.elements.n.value = p.n; form.elements.p.value = p.p; form.elements.c.value = p.c; form.elements.conn.value = p.conn || '';
  form.elements.d.value = p.d; form.elements.img.value = p.img || ''; form.elements.stock.value = p.stock || ''; form.elements.style.value = p.style || 'minimalista'; form.elements.off.checked = !!p.off;
  $$('input[name=col]').forEach(i => i.checked = (p.cols || []).includes(i.value));
  $$('input[name=mod]').forEach(i => i.checked = (p.models || []).includes(i.value));
  form.scrollIntoView();
}

//--------
function readForm() {
  const v = form.elements, cols = $$('input[name=col]:checked').map(i => i.value), models = $$('input[name=mod]:checked').map(i => i.value);
  const p = { id: editing || 'p' + Date.now(), n: v.n.value.trim(), p: Math.round(parseFloat(v.p.value) * 100) / 100, c: v.c.value, d: v.d.value.trim(), real: true };
  if (v.img.value.trim()) p.img = v.img.value.trim();
  if (v.stock.value) p.stock = v.stock.value;
  if (v.conn.value) p.conn = v.conn.value;
  if (v.off.checked) p.off = true;
  if (p.c === 'fundas') { p.style = v.style.value; p.cols = cols; p.models = models; p.opts = [['Color', cols], ['Modelo', models]]; }
  else if (models.length) { p.models = models; if (p.c === 'protectores') p.opts = [['Modelo', models]]; }
  return { p, cols, models };
}

function validate({ p, cols, models }) {
  if (p.n.length < 3) return 'El nombre debe tener al menos 3 letras.';
  if (!(p.p > 0)) return 'Escribe un precio mayor que cero.';
  if (p.img && !p.img.startsWith('assets/images/')) return 'La imagen debe estar en la carpeta assets/images/.';
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

$('#login').addEventListener('submit', e => {
  e.preventDefault();
  if ($('#pass').value === PASS) { try { sessionStorage.setItem('val_admin', '1'); } catch {} $('#loginErr').textContent = ''; show(); }
  else $('#loginErr').textContent = 'Contraseña incorrecta.';
});

$('#logout').addEventListener('click', () => { try { sessionStorage.removeItem('val_admin'); } catch {} show(); });

//--------
$('#fc').innerHTML = Object.entries(CATS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
$('#fcols').innerHTML = Object.keys(COLORS).map(c => `<label class="chk"><input type="checkbox" name="col" value="${c}"> ${c}</label>`).join('');
$('#fmodels').innerHTML = MODELS.map(m => `<label class="chk"><input type="checkbox" name="mod" value="${m}"> ${m}</label>`).join('');
show();
