(() => {
  "use strict";
  const SUPABASE_URL = "https://vryuupfijekwrlgebcwd.supabase.co";
  // Usa solo la clave pública publishable. Nunca pongas aquí service_role/secret.
  const SUPABASE_KEY = "sb_publishable_AkXH29nf8F8gyNhMVAXC7w_BZTruoRR";
  if (!window.supabase) {
    console.error("No se cargó Supabase JS. Revisa el CDN en el HTML.");
    return;
  }
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
})();
