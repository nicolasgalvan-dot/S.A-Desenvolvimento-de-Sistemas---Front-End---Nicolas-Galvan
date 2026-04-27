// ========================================================
// materia-page.js — Lógica da página dedicada de matéria
// ========================================================

// Mapeamento de chaves internas → nomes exibidos
var subjectMap = {
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

// ── Ler parâmetro da URL ────────────────────────────────
function getSubjectFromURL() {
  var params = new URLSearchParams(window.location.search);
  return params.get('materia') || '';
}

// ── Renderizar lista de atividades ──────────────────────
function renderActivities(subject, trimester) {
  var activities = getActivities(subject, trimester);

  if (!activities || activities.length === 0) {
    return (
      '<div class="empty-state">' +
        '<span class="empty-icon">📋</span>' +
        '<h3>Nenhuma atividade ainda</h3>' +
        '<p>As atividades do ' + trimester + 'º trimestre serão adicionadas em breve.</p>' +
      '</div>'
    );
  }

  var html = '';
  for (var i = 0; i < activities.length; i++) {
    html += renderActivityCard(activities[i]);
  }
  return html;
}

// ── Renderizar um card individual ───────────────────────
function renderActivityCard(a) {
  // Habilidades
  var habsHtml = '';
  if (a.habilidades && a.habilidades.length > 0) {
    habsHtml = '<ul class="habilidades-list">';
    for (var j = 0; j < a.habilidades.length; j++) {
      habsHtml += '<li>' + a.habilidades[j] + '</li>';
    }
    habsHtml += '</ul>';
  }

  // Preview
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

  return (
    '<div class="activity-card">' +
      '<h3>' + a.subject + '</h3>' +
      '<p class="activity-description">' + a.description + '</p>' +
      habsHtml +
      previewHtml +
    '</div>'
  );
}

// ── Configurar botões de trimestre ──────────────────────
function setupTrimesterButtons(subject) {
  var buttons = document.querySelectorAll('.trimester-btn');
  var grid = document.getElementById('activities-grid');

  for (var i = 0; i < buttons.length; i++) {
    (function(btn) {
      btn.addEventListener('click', function() {
        // Remove active de todos
        for (var j = 0; j < buttons.length; j++) {
          buttons[j].classList.remove('active');
        }
        // Ativa o clicado
        btn.classList.add('active');
        // Atualiza conteúdo
        grid.innerHTML = renderActivities(subject, btn.dataset.trimester);
        // Scroll suave para as atividades
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    })(buttons[i]);
  }
}

// ── Inicialização ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  var subject = getSubjectFromURL();

  if (!subject || !subjectMap[subject]) {
    // Matéria inválida, redireciona para a home
    window.location.href = 'portfolio_nicolas (1).html';
    return;
  }

  // Atualiza título da página e banner
  var title = subjectMap[subject];
  document.getElementById('titulo-materia').textContent = title;
  document.title = title + ' — Portfólio';

  // Renderiza atividades do 1º trimestre
  var grid = document.getElementById('activities-grid');
  grid.innerHTML = renderActivities(subject, '1');

  // Configura os botões de trimestre
  setupTrimesterButtons(subject);
});
