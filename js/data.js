const $ = (s, e = document) => e.querySelector(s);
const $$ = (s, e = document) => [...e.querySelectorAll(s)];
const money = n => '$' + n.toFixed(2);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

//--------
const DEFAULT_CATS = [
  { id: 'cables', name: 'Cables y conexiones' },
  { id: 'fundas', name: 'Fundas para celulares' },
  { id: 'cargadores', name: 'Cargadores y adaptadores' },
  { id: 'baterias', name: 'Baterías externas' },
  { id: 'reemplazo', name: 'Baterías de reemplazo compatibles' },
  { id: 'protectores', name: 'Protectores de pantalla' },
  { id: 'audifonos', name: 'Audífonos' },
  { id: 'soportes', name: 'Soportes para celulares' },
  { id: 'extras', name: 'Accesorios adicionales' }
];
const CATS = {};
const setCategories = list => { Object.keys(CATS).forEach(k => delete CATS[k]); list.forEach(c => CATS[c.id] = c.name); };
const catList = () => Object.entries(CATS).map(([id, name]) => ({ id, name }));
const validCats = a => Array.isArray(a) && a.every(c => c && /^[a-z0-9-]{1,40}$/.test(c.id) && typeof c.name === 'string' && c.name.trim().length >= 2 && c.name.length <= 40);

const COLORS = { Negro: '#1b1f2a', Azul: '#2b5cff', Verde: '#2fbf8a', Transparente: '#dfe8f3', Rosa: '#ff7ab8', Blanco: '#f4f7fb' };

//--------
const ALL = [];
let PRODUCTS = [];
const byId = id => ALL.find(p => p.id === id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safeImg = u => /^(data:image\/(jpeg|png|webp);base64,|https:\/\/|assets\/images\/)/.test(u || '') ? u : '';

//--------
const STYLES = ['minimalista', 'elegante', 'transparente', 'juvenil'];
const strs = a => Array.isArray(a) && a.every(x => typeof x === 'string' && x.length <= 60);

function normalize(p) {
  if (!p || typeof p.id !== 'string' || typeof p.n !== 'string' || typeof p.d !== 'string') return null;
  if (typeof p.p !== 'number' || !(p.p > 0) || p.p >= 100000 || !CATS[p.c]) return null;
  const q = { ...p }; delete q.opts;
  if (q.models !== undefined && !strs(q.models)) return null;
  if (q.c === 'fundas') {
    if (!strs(q.cols) || !q.cols.length || !q.cols.every(c => COLORS[c]) || !q.models || !q.models.length || !STYLES.includes(q.style)) return null;
    q.opts = [['Color', q.cols], ['Modelo', q.models]];
  } else if (q.c === 'protectores' && q.models && q.models.length) q.opts = [['Modelo', q.models]];
  return q;
}

function setProducts(list) {
  const a = [...list];
  ALL.length = 0; ALL.push(...a);
  PRODUCTS = ALL.filter(p => !p.off);
}

//--------
let catalogMode = 'published';
function loadCatalog() {
  const w = load('val_catalog', null);
  const useWork = w && typeof w.v === 'number' && w.v >= CATALOGO.v && Array.isArray(w.products);
  const src = useWork ? w : CATALOGO;
  setCategories(validCats(src.categories) ? src.categories : DEFAULT_CATS);
  setProducts((src.products || []).map(normalize).filter(Boolean));
  catalogMode = useWork && w.v > CATALOGO.v ? 'working' : 'published';
}

//--------
const BUSINESS = { name: 'Accesorios y reparaciones Valenzuela', owner: 'Raúl Ramos', phone: '7818-9762', intl: '50378189762' };
const waLink = text => 'https://wa.me/' + BUSINESS.intl + (text ? '?text=' + encodeURIComponent(text) : '');
const INFO_MSG = 'Hola, me gustaría obtener información sobre los productos y servicios de ' + BUSINESS.name;

//--------
const SERVICES = [
  { id: 's1', n: 'Diagnóstico de dispositivos', d: 'Revisión inicial para identificar qué le ocurre al equipo.' },
  { id: 's2', n: 'Revisión de problemas de carga', d: 'Consulta por equipos que no cargan o cargan con dificultad.' },
  { id: 's3', n: 'Reemplazo de componentes compatibles', d: 'Consulta por cambio de piezas compatibles con tu dispositivo.' },
  { id: 's4', n: 'Reparación de pantallas', d: 'Consulta por pantallas dañadas o con fallas.' },
  { id: 's5', n: 'Revisión de baterías', d: 'Consulta por baterías que duran poco o presentan fallas.' },
  { id: 's6', n: 'Solución de fallas de conexión', d: 'Consulta por problemas de conexión del equipo.' },
  { id: 's7', n: 'Otras reparaciones electrónicas', d: 'Cuéntanos tu caso y el negocio te indicará si puede revisarlo.' }
];
