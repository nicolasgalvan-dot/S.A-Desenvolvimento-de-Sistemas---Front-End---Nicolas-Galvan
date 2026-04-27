// ========================================================
// atividades.js — Lógica do overlay de atividades
// ========================================================

// Mapeamento de chaves internas → nomes exibidos
const subjectMap = {
  matematica: 'Matemática',
  natureza: 'Ciências da Natureza',
  humanas: 'Ciências Humanas',
  linguagens: 'Linguagens',
  modelagem: 'Modelagem de Sistemas',
  bancoDeDados: 'Banco de Dados',
  iot: 'Internet das Coisas',
  desenvolvimentoDeSistemas: 'Desenvolvimento de Sistemas',
  introducaoIndustriaProjetos: 'Intro. à Indústria de Projetos',
  introducaoIndustria40: 'Intro. à Indústria 4.0',
  sustentabilidade: 'Sustentabilidade nos Processos Ind.'
};

// ── Abrir o overlay ─────────────────────────────────────
function openOverlay(subject) {
  var overlay = document.getElementById('overlay');
  var content = document.getElementById('overlay-content');

  // Fecha o sidebar se estiver aberto
  var sidebar = document.getElementById('sidebar');
  if (sidebar && sidebar.classList.contains('aberta')) {
    sidebar.classList.remove('aberta');
  }

  content.innerHTML = renderSubjectContent(subject);
  setupTrimesterButtons(subject, content);

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ── Fechar o overlay ────────────────────────────────────
function closeOverlay() {
  var overlay = document.getElementById('overlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Renderizar o conteúdo da matéria ────────────────────
function renderSubjectContent(subject) {
  var title = subjectMap[subject] || subject;
  return (
    '<div class="subject-page">' +
      '<h2>' + title + '</h2>' +
      '<div class="subject-divider"></div>' +
      '<div class="trimester-selector">' +
        '<button class="trimester-btn active" data-trimester="1">' +
          '<span>1º Trimestre</span>' +
        '</button>' +
        '<button class="trimester-btn" data-trimester="2">' +
          '<span>2º Trimestre</span>' +
        '</button>' +
        '<button class="trimester-btn" data-trimester="3">' +
          '<span>3º Trimestre</span>' +
        '</button>' +
      '</div>' +
      '<div class="activities-grid">' +
        renderActivities(subject, '1') +
      '</div>' +
    '</div>'
  );
}

// ── Renderizar cards de atividades ──────────────────────
function renderActivities(subject, trimester) {
  var activities = getActivities(subject, trimester);

  if (!activities || activities.length === 0) {
    return (
      '<div class="empty-state">' +
        '<div class="empty-icon">📋</div>' +
        '<h3>Nenhuma atividade ainda</h3>' +
        '<p>As atividades do ' + trimester + 'º trimestre serão adicionadas em breve.</p>' +
      '</div>'
    );
  }

  var html = '';
  for (var i = 0; i < activities.length; i++) {
    var a = activities[i];
    html += renderActivityCard(a, i);
  }
  return html;
}

// ── Renderizar um card individual ───────────────────────
function renderActivityCard(a, index) {
  // Habilidades
  var habsHtml = '';
  if (a.habilidades && a.habilidades.length > 0) {
    habsHtml = '<ul class="habilidades-list">';
    for (var j = 0; j < a.habilidades.length; j++) {
      habsHtml += '<li>' + a.habilidades[j] + '</li>';
    }
    habsHtml += '</ul>';
  }

  // Preview (imagem, texto, link)
  var previewHtml = '';
  if (a.preview) {
    previewHtml = '<div class="preview-section">';

    if (a.preview.image) {
      if (a.preview.link) {
        previewHtml +=
          '<a href="' + a.preview.link + '" target="_blank" rel="noopener noreferrer">' +
            '<div class="preview-image-wrapper">' +
              '<img class="preview-image" src="' + a.preview.image + '" alt="' + a.subject + '">' +
            '</div>' +
          '</a>';
      } else {
        previewHtml +=
          '<div class="preview-image-wrapper">' +
            '<img class="preview-image" src="' + a.preview.image + '" alt="' + a.subject + '">' +
          '</div>';
      }
    } else if (a.preview.text) {
      previewHtml += '<p class="preview-text">' + a.preview.text + '</p>';
    }

    if (a.preview.link) {
      previewHtml +=
        '<a class="preview-link" href="' + a.preview.link + '" target="_blank" rel="noopener noreferrer">' +
          'Abrir documento' +
        '</a>';
    }

    previewHtml += '</div>';
  }

  // Delay de animação escalonado
  var delay = (index * 0.08) + 's';

  return (
    '<div class="activity-card" style="animation-delay: ' + delay + '">' +
      '<h3>' + a.subject + '</h3>' +
      '<p class="activity-description">' + a.description + '</p>' +
      habsHtml +
      previewHtml +
    '</div>'
  );
}

// ── Configurar botões de trimestre ──────────────────────
function setupTrimesterButtons(subject, container) {
  var buttons = container.querySelectorAll('.trimester-btn');

  for (var i = 0; i < buttons.length; i++) {
    (function(btn) {
      btn.addEventListener('click', function() {
        // Remove active de todos
        var allBtns = container.querySelectorAll('.trimester-btn');
        for (var j = 0; j < allBtns.length; j++) {
          allBtns[j].classList.remove('active');
        }
        // Ativa o clicado
        btn.classList.add('active');

        // Atualiza grid de atividades
        var grid = container.querySelector('.activities-grid');
        grid.innerHTML = renderActivities(subject, btn.dataset.trimester);
      });
    })(buttons[i]);
  }
}

// ── Event listeners (executados quando DOM estiver pronto) ──
document.addEventListener('DOMContentLoaded', function() {
  var closeBtn = document.getElementById('overlay-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeOverlay);
  }

  var backdrop = document.querySelector('.overlay__backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', closeOverlay);
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeOverlay();
    }
  });
});
