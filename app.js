const checks = [
  { key: 'browser', detail: `Detectado: ${navigator.userAgentData?.brands?.[0]?.brand || navigator.appName || 'navegador'}` },
  { key: 'javascript', detail: 'Runtime activo y respondiendo' },
  { key: 'storage', detail: 'Disponible para datos de prueba' }
];

const overallStatus = document.querySelector('#overall-status');
const findingList = document.querySelector('#finding-list');
const findingCount = document.querySelector('#finding-count');
const findingForm = document.querySelector('#finding-form');
const findingInput = document.querySelector('#finding-name');
const storageKey = 'defectdojo-check-findings';

function updateCheck(key, passed, detail) {
  const card = document.querySelector(`[data-check="${key}"]`);
  card.classList.toggle('pass', passed);
  card.classList.toggle('fail', !passed);
  card.querySelector('p').textContent = detail;
  card.querySelector('.status-dot').setAttribute('aria-label', passed ? 'Correcto' : 'Error');
}

function runChecks() {
  updateCheck('browser', Boolean(navigator.userAgent), checks[0].detail);
  updateCheck('javascript', true, checks[1].detail);
  try {
    localStorage.setItem('__defectdojo_check__', 'ok');
    localStorage.removeItem('__defectdojo_check__');
    updateCheck('storage', true, checks[2].detail);
  } catch (error) {
    updateCheck('storage', false, 'No disponible en esta sesión');
  }
  overallStatus.textContent = 'Entorno listo para pruebas';
}

function readFindings() {
  try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
}

function saveFindings(findings) {
  try { localStorage.setItem(storageKey, JSON.stringify(findings)); } catch { /* La app sigue siendo útil en modo temporal. */ }
}

function renderFindings() {
  const findings = readFindings();
  findingCount.textContent = findings.length;
  findingList.innerHTML = '';
  if (!findings.length) {
    findingList.innerHTML = '<li class="empty-state">Todavía no hay hallazgos de prueba.</li>';
    return;
  }
  findings.forEach((finding, index) => {
    const item = document.createElement('li');
    item.className = 'finding-item';
    item.innerHTML = `<span>${escapeHtml(finding)}</span><button class="remove-button" type="button" data-index="${index}">Eliminar</button>`;
    findingList.appendChild(item);
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

document.querySelector('#run-checks').addEventListener('click', runChecks);
findingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = findingInput.value.trim();
  if (!value) return;
  saveFindings([...readFindings(), value]);
  findingInput.value = '';
  renderFindings();
});
findingList.addEventListener('click', (event) => {
  if (!event.target.matches('.remove-button')) return;
  const findings = readFindings();
  findings.splice(Number(event.target.dataset.index), 1);
  saveFindings(findings);
  renderFindings();
});

document.querySelector('#clock').textContent = new Date().toLocaleTimeString('es-ES');
renderFindings();
