const $ = (s, e = document) => e.querySelector(s);
const $$ = (s, e = document) => [...e.querySelectorAll(s)];
const money = n => '$' + n.toFixed(2);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

//--------
const CATS = {
  cables: 'Cables y conexiones', fundas: 'Fundas para celulares', cargadores: 'Cargadores y adaptadores',
  baterias: 'Baterías externas', reemplazo: 'Baterías de reemplazo compatibles', protectores: 'Protectores de pantalla',
  soportes: 'Soportes para celulares', audifonos: 'Audífonos', extras: 'Accesorios adicionales'
};
const MODELS = ['Galaxy A15', 'Redmi 13', 'iPhone 13', 'Moto G54'];
const COLORS = { Negro: '#1b1f2a', Azul: '#2b5cff', Verde: '#2fbf8a', Transparente: '#dfe8f3', Rosa: '#ff7ab8', Blanco: '#f4f7fb' };

//--------
const DEFAULTS = [
  { id: 'p1', n: 'Cable FlexCharge USB-C', p: 4.99, c: 'cables', conn: 'USB-C', d: 'Cable para cargar y transferir datos en dispositivos compatibles.', opts: [['Longitud', ['1 m', '2 m', '3 m']]] },
  { id: 'p2', n: 'Funda UrbanShield', p: 6.5, c: 'fundas', style: 'juvenil', cols: ['Negro', 'Azul', 'Verde'], models: MODELS, d: 'Funda protectora de diseño moderno.' },
  { id: 'p3', n: 'Cargador Nexa 20W', p: 8.99, c: 'cargadores', conn: 'USB-C', d: 'Adaptador de corriente para dispositivos compatibles.', spec: 'Potencia: 20 W. Estándares: dato demostrativo, verificar con la ficha del proveedor.' },
  { id: 'p4', n: 'GlassGuard HD', p: 3.99, c: 'protectores', models: MODELS, d: 'Protector de vidrio templado para modelos compatibles.', opts: [['Modelo', MODELS]] },
  { id: 'p5', n: 'PowerGo 10K', p: 17.99, c: 'baterias', conn: 'USB-C', d: 'Batería portátil conceptual de 10,000 mAh para dispositivos compatibles.' },
  { id: 'p6', n: 'Adaptador LinkPro', p: 3.5, c: 'cargadores', conn: 'USB-C', d: 'Adaptador para conexiones compatibles.', spec: 'Entrada: USB-A. Salida: USB-C (dato demostrativo).' },
  { id: 'p7', n: 'Cable MicroFlex', p: 3.5, c: 'cables', conn: 'Micro-USB', d: 'Cable micro-USB para dispositivos compatibles.' },
  { id: 'p8', n: 'StandPocket', p: 4.5, c: 'soportes', d: 'Soporte compacto y ajustable para teléfonos celulares.' },
  { id: 'p9', n: 'Funda ClearView', p: 5.25, c: 'fundas', style: 'transparente', cols: ['Transparente'], models: MODELS, d: 'Funda transparente que deja ver el color del teléfono.' },
  { id: 'p10', n: 'Funda SoftMini', p: 5.99, c: 'fundas', style: 'minimalista', cols: ['Negro', 'Blanco'], models: ['Galaxy A15', 'Redmi 13', 'Moto G54'], d: 'Funda delgada de acabado liso.' },
  { id: 'p11', n: 'Funda Aurora Gold', p: 9.5, c: 'fundas', style: 'elegante', cols: ['Negro', 'Rosa', 'Blanco'], models: ['iPhone 13', 'Galaxy A15'], d: 'Funda de acabado elegante con bordes reforzados.' },
  { id: 'p12', n: 'Audífonos BudLine', p: 9.9, c: 'audifonos', d: 'Audífonos con cable para uso diario.' }
];
DEFAULTS.forEach(p => {
  if (p.c === 'fundas') p.opts = [['Color', p.cols], ['Modelo', p.models]];
});
const ALL = load('val_products', null) || DEFAULTS;
const PRODUCTS = ALL.filter(p => !p.off);
const byId = id => ALL.find(p => p.id === id);

const BUNDLES = [
  { id: 'b1', n: 'Cable USB-C + cargador', items: ['p1', 'p3'], price: 12.99, cond: 'Cable de 1 m. Verificar compatibilidad con tu dispositivo.' },
  { id: 'b2', n: 'Funda + protector de pantalla', items: ['p2', 'p4'], price: 9.99, cond: 'Elige modelo al ver los productos individuales; paquete demostrativo.' },
  { id: 'b3', n: 'Adaptador + cable de carga', items: ['p6', 'p1'], price: 7.99, cond: 'Sujeto a verificar tipo de conexión.' }
];

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
