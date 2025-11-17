function openService(id) {
    document.querySelectorAll('.service-content').forEach(section => {
        section.classList.remove('active');
        section.querySelectorAll('.gallery-item').forEach(item => {
            item.style.opacity = 0;
            item.style.transform = 'translateY(20px)';
        });
    });

    const section = document.getElementById(id);
    section.classList.add('active');
    section.scrollIntoView({behavior: 'smooth'});
}
