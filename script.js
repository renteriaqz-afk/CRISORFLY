/* script.js - CRISORFLY
   Lee listados de carpetas relativas en GitHub Pages (p.ej. "img/fotografia/")
   y crea galerías automáticas con imágenes y videos.
*/

// ---------------- utilidades ----------------
function isImage(name) {
  return /\.(jpe?g|png|gif|webp|bmp)$/i.test(name);
}
function isVideo(name) {
  return /\.(mp4|mov|webm|ogv|mkv|avi)$/i.test(name);
}

// Inserta un mensaje en un contenedor
function showMessage(container, text) {
  container.innerHTML = `<p style="color:#cfcfcf;opacity:0.9">${text}</p>`;
}

// ---------------- cargar carpeta y renderizar ----------------
/*
  loadFolderIntoGrid(rutaRelativa, idContenedor)
  - rutaRelativa: por ejemplo "img/fotografia/" o "video/"
  - idContenedor: id del div donde se pondrán elementos
*/
async function loadFolderIntoGrid(rutaRelativa, idContenedor) {
  const container = document.getElementById(idContenedor);
  if (!container) return;

  container.innerHTML = ''; // limpiar

  try {
    // Petición a la ruta relativa; en GitHub Pages esto devuelve un HTML con enlaces
    const res = await fetch(rutaRelativa);
    if (!res.ok) {
      showMessage(container, 'No se encontró la carpeta o está vacía.');
      return;
    }
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');

    // Buscamos enlaces (<a>) en el listado
    const enlaces = Array.from(doc.querySelectorAll('a'))
                         .map(a => a.getAttribute('href'))
                         .filter(h => h && h !== '../'); // excluir enlace padre

    if (enlaces.length === 0) {
      showMessage(container, 'No hay archivos en esta carpeta.');
      return;
    }

    // Renderizar cada archivo
    for (const href of enlaces) {
      const lower = href.toLowerCase();
      // Evitar index.html listados o archivos no útiles
      if (lower.endsWith('/')) continue;

      // Construir URL completa relativa (rutaRelativa + href)
      const url = rutaRelativa + href;

      if (isImage(href)) {
        const img = document.createElement('img');
        img.src = url;
        img.alt = href;
        img.className = 'gallery-item';
        img.loading = 'lazy';
        container.appendChild(img);
      } else if (isVideo(href)) {
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        video.className = 'gallery-item video-item';
        container.appendChild(video);
      } else {
        // Optionally show other files (skip)
      }
    }

  } catch (err) {
    console.error('Error cargando carpeta:', rutaRelativa, err);
    showMessage(container, 'Error cargando archivos. Revisa la ruta o permisos.');
  }
}

// ---------------- ayudas para páginas principales ----------------
function setupBackToTop(btnId = 'btnTop') {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 360) btn.classList.add('visible');
    else btn.classList.remove('visible');
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function simpleAnimations() {
  // show elements with class .fade-in when intersecting
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('show');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ---------------- inicialización general ----------------
document.addEventListener('DOMContentLoaded', () => {
  // animaciones y botón top si existe
  simpleAnimations();
  setupBackToTop('btnTop');

  // Páginas específicas: detectamos por presencia de contenedores
  // Fotografía page (fotografia.html) busca #galeria
  if (document.getElementById('galeria')) {
    loadFolderIntoGrid('img/fotografia/', 'galeria'); // mantiene compatibilidad con versión previa
  }

  // videos.html -> carpeta 'video/' (o 'video/XXX')
  if (document.getElementById('galeria') && location.pathname.endsWith('videos.html')) {
    loadFolderIntoGrid('video/', 'galeria');
  }

  // páginas modernas que usan grid ids:
  if (document.getElementById('grid-imagenes')) {
    loadFolderIntoGrid('media/imagenes/', 'grid-imagenes');
  }
  if (document.getElementById('grid-videos')) {
    loadFolderIntoGrid('media/videos/', 'grid-videos');
  }
  if (document.getElementById('grid-obras')) {
    loadFolderIntoGrid('media/obras/', 'grid-obras');
  }

  // páginas de ejemplo que pedimos: fotografia.html, videos.html, obras.html
  if (document.getElementById('galeria') && location.pathname.endsWith('fotografia.html')) {
    loadFolderIntoGrid('img/fotografia/', 'galeria');
  }
  if (document.getElementById('galeria') && location.pathname.endsWith('videos.html')) {
    loadFolderIntoGrid('video/', 'galeria');
  }
  if (document.getElementById('galeria') && location.pathname.endsWith('obras.html')) {
    // obras.html uses two containers by inline script; handled there
  }
});
