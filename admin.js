(() => {
  "use strict";
  const sb = () => window.supabaseClient;
  const $ = (s, e = document) => e.querySelector(s);
  const $$ = (s, e = document) => [...e.querySelectorAll(s)];
  const MODEL_CATS = ["cables", "cargadores", "baterias", "reemplazo", "audifonos", "soportes", "extras"];
  let editing = null, image = "", currentUser = null;
  const form = $("#pform");
  const money = n => "$" + Number(n || 0).toFixed(2);
  const msg = (s, t) => { const e = $(s); if (e) e.textContent = t || ""; };
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  function fromDb(r) {
    return { id:r.id, n:r.name, p:Number(r.price), c:r.category, d:r.description||"",
      img:r.image_url||"", conn:r.connector||"", modelo:r.model||"", style:r.style||"minimalista",
      cols:Array.isArray(r.colors)?r.colors:[], models:Array.isArray(r.compatible_models)?r.compatible_models:[],
      opts:Array.isArray(r.options)?r.options:[], stock:Number(r.stock)>0?"Disponible":"Agotado",
      off:!!r.is_hidden, real:true };
  }
  function toDb(p, imageUrl) {
    return { id:p.id, name:p.n, price:Number(p.p), category:p.c, description:p.d||"",
      image_url:imageUrl||null, connector:p.conn||null, model:p.modelo||null, style:p.style||null,
      colors:p.cols||[], compatible_models:p.models||[], stock:String(p.stock).toLowerCase()==="disponible"?1:0,
      is_hidden:!!p.off, options:p.opts||[], updated_at:new Date().toISOString() };
  }
  async function checkAdmin(user) {
    const {data,error}=await sb().from("app_admins").select("user_id").eq("user_id",user.id).maybeSingle();
    if(error) throw new Error("No se pudo verificar app_admins: "+error.message);
    if(!data) throw new Error("Esta cuenta no está autorizada. Añade su UID completo a public.app_admins.");
  }
  async function loadProducts() {
    const {data,error}=await sb().from("products").select("*").order("created_at",{ascending:false});
    if(error) throw new Error("Error cargando productos: "+error.message);
    const rows=(data||[]).map(fromDb);
    ALL.splice(0,ALL.length,...rows);
    PRODUCTS.splice(0,PRODUCTS.length,...rows.filter(p=>!p.off));
    renderRows();
  }
  function renderRows() {
    if(!$("#rows")) return;
    $("#rows").innerHTML=ALL.map(p=>`<tr>
      <td>${p.img?`<img class="th" src="${esc(p.img)}" alt="">`:"—"}</td>
      <td>${esc(p.n)}</td><td>${esc(p.modelo||"—")}</td><td>${esc(CATS[p.c]||p.c)}</td>
      <td>${money(p.p)}</td><td>${p.off?"Oculto":"Visible"}</td><td class="acts">
      <button type="button" class="link" data-act="edit" data-id="${esc(p.id)}">Editar</button>
      <button type="button" class="link" data-act="toggle" data-id="${esc(p.id)}">${p.off?"Mostrar":"Ocultar"}</button>
      <button type="button" class="link" data-act="del" data-id="${esc(p.id)}">Eliminar</button></td></tr>`).join("")
      ||'<tr><td colspan="7">No hay productos registrados. Agrega el primero con el formulario.</td></tr>';
  }
  function toggleFields() {
    if(!form) return;
    $$("[data-show]").forEach(el=>el.hidden=!el.dataset.show.split(",").includes(form.elements.c.value));
  }
  function preview() {
    if($("#imgPrev")) $("#imgPrev").innerHTML=image?`<img src="${image}" alt="Vista previa">`:"Sin imagen";
  }
  function resetForm() {
    editing=null; image=""; form.reset(); preview(); toggleFields();
    msg("#formTitle","Agregar producto"); msg("#perr","");
    if($("#file")) $("#file").value="";
  }
  function fillForm(p) {
    const v=form.elements; editing=p.id; image=p.img||""; msg("#formTitle","Editar producto");
    v.n.value=p.n||""; v.p.value=p.p||""; v.c.value=p.c||""; v.conn.value=p.conn||"";
    v.modelo.value=p.modelo||""; v.d.value=p.d||""; v.style.value=p.style||"minimalista";
    v.off.checked=!!p.off; if(v.stock) v.stock.value=p.stock||"Agotado";
    $$('input[name="col"]').forEach(i=>i.checked=(p.cols||[]).includes(i.value));
    $$('input[name="mod"]').forEach(i=>i.checked=(p.models||[]).includes(i.value));
    preview(); toggleFields(); form.scrollIntoView({behavior:"smooth",block:"start"});
  }
  function loadImage(file) {
    if(!file) return;
    if(!file.type.startsWith("image/")) return msg("#perr","El archivo debe ser una imagen.");
    if(file.size>5*1024*1024) return msg("#perr","La imagen supera 5 MB.");
    const reader=new FileReader();
    reader.onload=()=>{const im=new Image(); im.onload=()=>{
      const scale=Math.min(1,900/im.width,900/im.height), c=document.createElement("canvas");
      c.width=Math.max(1,Math.round(im.width*scale)); c.height=Math.max(1,Math.round(im.height*scale));
      c.getContext("2d").drawImage(im,0,0,c.width,c.height); image=c.toDataURL("image/jpeg",0.82); preview();
    }; im.onerror=()=>msg("#perr","No se pudo procesar la imagen."); im.src=reader.result;};
    reader.onerror=()=>msg("#perr","No se pudo leer la imagen."); reader.readAsDataURL(file);
  }
  function readForm() {
    const v=form.elements, cols=$$('input[name="col"]:checked').map(i=>i.value), models=$$('input[name="mod"]:checked').map(i=>i.value);
    const p={id:editing||("p"+(crypto.randomUUID?crypto.randomUUID():Date.now())),n:v.n.value.trim(),
      p:Math.round(Number.parseFloat(v.p.value)*100)/100,c:v.c.value,d:v.d.value.trim(),conn:v.conn.value.trim(),
      modelo:v.modelo.value.trim(),style:v.style.value||"minimalista",off:!!v.off.checked,
      stock:v.stock?v.stock.value:"Agotado",cols,models,opts:[]};
    if(p.c==="fundas") p.opts=[["Color",cols],["Modelo",models]];
    else if(p.c==="protectores"&&models.length) p.opts=[["Modelo",models]];
    return p;
  }
  function validate(p) {
    if(p.n.length<3) return "El nombre necesita al menos 3 caracteres.";
    if(!(p.p>0)||!Number.isFinite(p.p)) return "Escribe un precio mayor que cero.";
    if(p.d.length<5) return "Escribe una descripción breve.";
    if(p.c==="fundas"&&(!p.cols.length||!p.models.length)) return "Las fundas necesitan color y modelo.";
    return "";
  }
  async function uploadImageIfNeeded(id) {
    if(!image) return null;
    if(!image.startsWith("data:image/")) return image;
    const blob=await (await fetch(image)).blob(), path=`${id}/${Date.now()}.jpg`;
    const {error}=await sb().storage.from("product-images").upload(path,blob,{contentType:"image/jpeg",upsert:false});
    if(error) throw new Error("Error subiendo imagen: "+error.message);
    return sb().storage.from("product-images").getPublicUrl(path).data.publicUrl;
  }
  async function saveProduct(e) {
    e.preventDefault(); const p=readForm(), error=validate(p); msg("#perr",error); if(error) return;
    const submit=form.querySelector('[type="submit"]'); if(submit) submit.disabled=true;
    try {
      const imageUrl=await uploadImageIfNeeded(p.id);
      const {error:saveError}=await sb().from("products").upsert(toDb(p,imageUrl||(image.startsWith("http")?image:null)),{onConflict:"id"});
      if(saveError) throw new Error("No se pudo guardar: "+saveError.message);
      await loadProducts(); resetForm();
    } catch(err) { msg("#perr",err.message||"No se pudo guardar."); console.error(err); }
    finally { if(submit) submit.disabled=false; }
  }
  async function rowsClick(e) {
    const b=e.target.closest("[data-act]"); if(!b) return;
    const p=ALL.find(x=>x.id===b.dataset.id); if(!p) return;
    try {
      if(b.dataset.act==="edit") return fillForm(p);
      if(b.dataset.act==="toggle") {
        const {error}=await sb().from("products").update({is_hidden:!p.off,updated_at:new Date().toISOString()}).eq("id",p.id);
        if(error) throw error; await loadProducts(); return;
      }
      if(b.dataset.act==="del") {
        if(BUNDLES.some(x=>x.items.includes(p.id))) return alert("Este producto forma parte de una oferta. Ocúltalo en lugar de eliminarlo.");
        if(!confirm(`¿Eliminar "${p.n}" de Supabase?`)) return;
        const {error}=await sb().from("products").delete().eq("id",p.id);
        if(error) throw error; await loadProducts();
      }
    } catch(err) { alert(err.message||"No se pudo completar la acción."); }
  }
  async function login(e) {
    e.preventDefault(); msg("#loginErr","");
    const {data,error}=await sb().auth.signInWithPassword({email:$("#user").value.trim(),password:$("#pass").value});
    if(error) return msg("#loginErr","Correo o contraseña incorrectos.");
    try {
      await checkAdmin(data.user); currentUser=data.user; await loadProducts();
      $("#gate").hidden=true; $("#panel").hidden=false; if($("#logout")) $("#logout").hidden=false;
      if($("#who")) $("#who").textContent=data.user.email||"Administrador"; $("#pass").value="";
    } catch(err) { await sb().auth.signOut(); msg("#loginErr",err.message); }
  }
  async function logout() {
    await sb().auth.signOut(); currentUser=null; $("#gate").hidden=false; $("#panel").hidden=true;
    if($("#logout")) $("#logout").hidden=true;
  }
  async function changePassword(e) {
    e.preventDefault(); const v=e.target.elements;
    if(!currentUser) return msg("#pwMsg","Inicia sesión de nuevo.");
    if(v.nw.value.length<8) return msg("#pwMsg","Usa al menos 8 caracteres.");
    if(v.nw.value!==v.nw2.value) return msg("#pwMsg","Las contraseñas nuevas no coinciden.");
    const {error:verify}=await sb().auth.signInWithPassword({email:currentUser.email,password:v.cur.value});
    if(verify) return msg("#pwMsg","La contraseña actual no coincide.");
    const {error}=await sb().auth.updateUser({password:v.nw.value});
    if(error) return msg("#pwMsg","No se pudo actualizar: "+error.message);
    e.target.reset(); msg("#pwMsg","Contraseña actualizada en Supabase.");
  }
  function populateOptions() {
    if($("#fc")) $("#fc").innerHTML=Object.entries(CATS).map(([k,v])=>`<option value="${k}">${esc(v)}</option>`).join("");
    if($("#fcols")) $("#fcols").innerHTML=Object.keys(COLORS).map(c=>`<label class="chk"><input type="checkbox" name="col" value="${esc(c)}"> ${esc(c)}</label>`).join("");
    if($("#fmodels")) $("#fmodels").innerHTML=MODELS.map(m=>`<label class="chk"><input type="checkbox" name="mod" value="${esc(m)}"> ${esc(m)}</label>`).join("");
  }
  async function init() {
    if(!form||!$("#login")||!$("#gate")||!$("#panel")||!$("#rows")) { console.error("Faltan elementos esperados en admin.html."); return; }
    if(!sb()) { msg("#loginErr","Supabase no se inicializó. Revisa los scripts."); return; }
    populateOptions();
    form.addEventListener("submit",saveProduct); form.elements.c.addEventListener("change",toggleFields);
    $("#file")?.addEventListener("change",e=>loadImage(e.target.files[0]));
    $("#noImg")?.addEventListener("click",()=>{image="";if($("#file"))$("#file").value="";preview();});
    $("#cancel")?.addEventListener("click",resetForm); $("#rows").addEventListener("click",rowsClick);
    $("#login").addEventListener("submit",login);
    $("#showPass")?.addEventListener("change",e=>$("#pass").type=e.target.checked?"text":"password");
    $("#logout")?.addEventListener("click",logout); $("#pwForm")?.addEventListener("submit",changePassword);
    $("#reset")?.addEventListener("click",()=>alert("Los productos se administran en Supabase. Usa Ocultar o Eliminar."));
    const {data}=await sb().auth.getSession(), user=data?.session?.user;
    if(user) {
      try { await checkAdmin(user); currentUser=user; await loadProducts(); $("#gate").hidden=true; $("#panel").hidden=false;
        if($("#logout"))$("#logout").hidden=false; if($("#who"))$("#who").textContent=user.email||"Administrador";
      } catch { await sb().auth.signOut(); $("#gate").hidden=false; $("#panel").hidden=true; }
    } else { $("#gate").hidden=false; $("#panel").hidden=true; if($("#logout"))$("#logout").hidden=true; }
    toggleFields(); preview();
  }
  document.addEventListener("DOMContentLoaded",init);
})();
