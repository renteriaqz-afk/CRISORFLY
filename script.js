// === MOSTRAR SUBMENÚS ===
document.querySelectorAll(".tarjeta").forEach(card => {
    card.addEventListener("click", () => {
        let target = document.getElementById(card.dataset.target);
        target.style.display = target.style.display === "block" ? "none" : "block";
    });
});

// === GALERÍAS ===
function cargarGaleria(ruta, contenedorId, tipo) {
    fetch(ruta)
    .then(res => res.text())
    .then(html => {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");
        let contenedor = document.getElementById(contenedorId);
        contenedor.innerHTML = "";

        doc.querySelectorAll("a").forEach(a => {
            let archivo = a.getAttribute("href");
            if (archivo.endsWith(".jpg") || archivo.endsWith(".png")) {
                let img = document.createElement("img");
                img.src = ruta + archivo;
                contenedor.appendChild(img);
            }

            if (archivo.endsWith(".mp4") || archivo.endsWith(".mov")) {
                let video = document.createElement("video");
                video.src = ruta + archivo;
                video.controls = true;
                contenedor.appendChild(video);
            }
        });
    });
}

// Cargar galerías
cargarGaleria("img/fotografia/", "galeria-foto");
cargarGaleria("img/videos/", "galeria-video");
cargarGaleria("img/obras/", "galeria-obras");
