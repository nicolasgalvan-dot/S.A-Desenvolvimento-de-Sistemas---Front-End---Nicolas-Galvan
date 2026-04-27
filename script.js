// Função para alternar modo escuro/claro
function toggleDarkMode() {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        icon.textContent = '🌙';
        localStorage.setItem('tema', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        icon.textContent = '☀️';
        localStorage.setItem('tema', 'dark');
    }
}

// Carregar tema salvo ao abrir a página
(function() {
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        const icon = document.getElementById('themeIcon');
        if (icon) icon.textContent = '☀️';
    }
})();

// Função para abrir e fechar o menu lateral
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("aberta");
}

// Lógica dos menus sanfona (Técnico, Matemática, etc) para abrir as sub-matérias
const accordions = document.querySelectorAll(".accordion");

accordions.forEach(acc => {
    acc.addEventListener("click", function() {
        // Pega o submenu logo abaixo do botão clicado
        let submenu = this.nextElementSibling;
        submenu.classList.toggle("aberto");
        
        // Gira a setinha
        let seta = this.querySelector(".seta");
        if(submenu.classList.contains("aberto")) {
            seta.style.transform = "rotate(180deg)";
        } else {
            seta.style.transform = "rotate(0deg)";
        }
    });
});

// Lógica do botão "Voltar ao topo"
window.addEventListener('scroll', function() {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
});

// Fechar sidebar ao clicar em um link (melhora UX mobile)
document.querySelectorAll('.menu-item, .sub-item').forEach(item => {
    item.addEventListener('click', () => {
        if (!item.classList.contains('accordion')) {
            const sidebar = document.getElementById("sidebar");
            if (sidebar) sidebar.classList.remove("aberta");
        }
    });
});