// Mostrar secciones
function mostrarSeccion(id) {
    document.querySelectorAll(".media-section").forEach(sec => sec.style.display = "none");
    document.getElementById(id).style.display = "block";
    window.scrollTo({ top: document.getElementById(id).offsetTop - 80, behavior: "smooth" });
}

// Scroll suave a contacto
function scrollToSection(id) {
    window.scrollTo({ top: document.getElementById(id).offsetTop - 80, behavior: "smooth" });
}

// Animación al cargar
window.onload = () => {
    document.body.classList.add("loaded");
};

// Mostrar botón arriba
window.addEventListener("scroll", () => {
    const btn = document.getElementById("btnTop");
    if (window.scrollY > 350) btn.classList.add("visible");
    else btn.classList.remove("visible");
});

// Carga automática de archivos desde GitHub
async function cargarMedia(tipo, carpeta, elementoHTML) {
    try {
        const url = `https://api.github.com/repos/JhonCRISORFLY/CRISORFLY/contents/media/${carpeta}`;
        const response = await fetch(url);
        const data = await response.json();

        data.forEach(file => {
            if (file.name.match(/\.(jpg|png|jpeg|webp)$/i)) {
                elementoHTML.innerHTML += `<img src="${file.download_url}">`;
            }
            if (file.name.match(/\.(mp4|mov|avi)$/i)) {
                elementoHTML.innerHTML += `<video src="${file.download_url}" controls></video>`;
            }
        });

    } catch (error) {
        console.log("Error cargando media:", error);
    }
}

cargarMedia("imagenes", "imagenes", document.getElementById("grid-imagenes"));
cargarMedia("videos", "videos", document.getElementById("grid-videos"));
cargarMedia("obras", "obras", document.getElementById("grid-obras"));
