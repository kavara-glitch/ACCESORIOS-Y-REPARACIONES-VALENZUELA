
/*
 * ACCESORIOS Y REPARACIONES VALENZUELA
 * Cliente de conexión con Supabase
 */

(() => {
    "use strict";

    // Dirección de tu proyecto Supabase
    const SUPABASE_URL =
        "https://vryuupfijekwrlgebcwd.supabase.co";

    // Clave pública de tu proyecto
    const SUPABASE_KEY =
        "sb_publishable_AkXH29nf8F8gyNhMVAXC7w_BZTruoRR";

    // Comprobar que la biblioteca esté cargada
    if (!window.supabase) {
        console.error(
            "Error: no se cargó la biblioteca de Supabase."
        );
        return;
    }

    // Crear la conexión
    window.supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

    console.log(
        "Cliente de Supabase inicializado correctamente."
    );
})();
