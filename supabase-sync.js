(() => {
  "use strict";
  const sb = () => window.supabaseClient;

  function fromDb(r) {
    return {
      id: r.id, n: r.name, p: Number(r.price), c: r.category,
      d: r.description || "", img: r.image_url || "", conn: r.connector || "",
      modelo: r.model || "", style: r.style || "minimalista",
      cols: Array.isArray(r.colors) ? r.colors : [],
      models: Array.isArray(r.compatible_models) ? r.compatible_models : [],
      opts: Array.isArray(r.options) ? r.options : [],
      stock: Number(r.stock) > 0 ? "Disponible" : "Agotado",
      off: !!r.is_hidden, real: true
    };
  }

  async function loadCatalogFromSupabase() {
    if (!sb()) return;
    const { data, error } = await sb().from("products").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Error cargando productos de Supabase:", error.message);
      return;
    }
    const rows = (data || []).map(fromDb);
    ALL.splice(0, ALL.length, ...rows);
    PRODUCTS.splice(0, PRODUCTS.length, ...rows.filter(p => !p.off));
    if (typeof renderAll === "function") renderAll();
    if (typeof renderBundles === "function") renderBundles();
    if (typeof renderCart === "function") renderCart();
    if (typeof renderFavs === "function") renderFavs();
    if (typeof renderFinder === "function") renderFinder();
    if (typeof renderStyle === "function") renderStyle();
  }

  window.loadCatalogFromSupabase = loadCatalogFromSupabase;
  document.addEventListener("DOMContentLoaded", loadCatalogFromSupabase);
})();
