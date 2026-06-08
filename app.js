// =============================================
//  STUDYFLOW — app.js
//  Mantém toda a lógica original +
//  + API Ninjas (curiosidades)
//  + Telas: Progresso, Configurações
//  + Rodapé, avatar no topbar, etc.
// =============================================

// --- CHAVE API NINJAS ---
const API_NINJAS_KEY = 'ZCnMv8Ib5a0A6aW0igObLadFwqS5joX9enX8Bgxr';

// --- ESTADO GLOBAL ---
const state = {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
    revisions: JSON.parse(localStorage.getItem('revisions')) || [],
    completedPomos: parseInt(localStorage.getItem('completedPomos')) || 0,
    savedFacts: JSON.parse(localStorage.getItem('savedFacts')) || [],
    pomoHistory: JSON.parse(localStorage.getItem('pomoHistory')) || [],
};

function saveState() {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    localStorage.setItem('revisions', JSON.stringify(state.revisions));
    localStorage.setItem('completedPomos', state.completedPomos.toString());
    localStorage.setItem('savedFacts', JSON.stringify(state.savedFacts));
    localStorage.setItem('pomoHistory', JSON.stringify(state.pomoHistory));
    updateDashboard();
}

// --- TOASTS ---
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// --- LOGIN / LOGOUT ---
const loginForm = document.getElementById('login-form');
const loginView = document.getElementById('login-view');
const appView = document.getElementById('app-view');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginView.classList.add('hidden');
    appView.classList.remove('hidden');
    localStorage.setItem('isLoggedIn', 'true');
    initApp();
    showToast('Bem-vindo ao StudyFlow!');
});

document.getElementById('logout-btn').addEventListener('click', () => {
    appView.classList.add('hidden');
    loginView.classList.remove('hidden');
    loginForm.reset();
    localStorage.removeItem('isLoggedIn');
});

function initApp() {
    fetchQuote();
    updateAvatarDisplay(currentSeed);
    renderTasks();
    renderRevisions();
    renderSavedFacts();
    updateDashboard();
    updateProgresso();
    setFooterDate();
    syncConfigToggles();
}

// --- NAVEGAÇÃO ---
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.content-section');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.getAttribute('data-target');
        sections.forEach(sec => {
            sec.id === target ? sec.classList.remove('hidden') : sec.classList.add('hidden');
        });
        if (target === 'progresso') updateProgresso();
    });
});

// --- API: FRASES MOTIVACIONAIS (AdviceSlip) ---
async function fetchQuote() {
    const quoteText = document.getElementById('quote-text');
    const localQuotes = [
        '"A excelência não é um ato, mas um hábito." — Aristóteles',
        '"Apressa-te a viver bem. Cada dia é uma vida." — Sêneca',
        '"O homem que move montanhas começa pelas pedras pequenas." — Confúcio',
        '"A paciência é amarga, mas seu fruto é doce." — Rousseau',
        '"Sem disciplina, não há liberdade." — Aristóteles',
    ];
    quoteText.textContent = localQuotes[Math.floor(Math.random() * localQuotes.length)];
    try {
        const res = await fetch('https://api.adviceslip.com/advice');
        if (!res.ok) throw new Error();
        const data = await res.json();
        quoteText.textContent = `"${data.slip.advice}" — AdviceSlip`;
    } catch {
        // Mantém frase local
    }
}

// --- API NINJAS: CURIOSIDADES ---
let currentFact = '';

document.getElementById('btn-new-fact').addEventListener('click', fetchFact);

async function fetchFact() {
    const factBox = document.getElementById('fact-box');
    const category = document.getElementById('fact-category').value;
    factBox.innerHTML = '<em>Buscando curiosidade...</em>';

    try {
        // Usando o endpoint de Facts da API Ninjas
        const res = await fetch(`https://api.api-ninjas.com/v1/facts?limit=1`, {
            headers: { 'X-Api-Key': API_NINJAS_KEY }
        });

        if (!res.ok) throw new Error('Erro na API Ninjas');
        const data = await res.json();

        if (data && data.length > 0) {
            currentFact = data[0].fact;
            factBox.innerHTML = `
                <p>${currentFact}</p>
                <button class="fact-save-btn" id="btn-save-fact" style="margin-top:0.8rem">
                    + Salvar esta curiosidade
                </button>
            `;
            document.getElementById('btn-save-fact').addEventListener('click', saveFact);
        } else {
            factBox.innerHTML = '<em>Nenhuma curiosidade encontrada. Tente outra categoria.</em>';
        }
    } catch (err) {
        // Fallback com fatos educacionais locais
        const fallbackFacts = [
            'O cérebro humano tem capacidade de armazenar cerca de 2,5 petabytes de informação.',
            'Estudar antes de dormir ajuda a consolidar a memória, segundo pesquisas da Universidade de Notre Dame.',
            'A técnica Pomodoro foi criada por Francesco Cirillo nos anos 1980 usando um timer de tomate.',
            'O efeito de espaçamento mostra que revisar conteúdo em intervalos aumenta a retenção em até 80%.',
            'Escrever à mão ativa mais áreas do cérebro do que digitar, melhorando a fixação do conteúdo.',
            'Dormir menos de 6 horas reduz a capacidade cognitiva equivalente a ficar 48 horas acordado.',
            'A técnica de Active Recall é considerada a mais eficiente para retenção de longo prazo.',
        ];
        currentFact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
        factBox.innerHTML = `
            <p>${currentFact}</p>
            <small style="color:var(--text-muted); font-size:11px">Fonte local (API indisponível)</small>
            <br>
            <button class="fact-save-btn" id="btn-save-fact" style="margin-top:0.8rem">
                + Salvar esta curiosidade
            </button>
        `;
        document.getElementById('btn-save-fact').addEventListener('click', saveFact);
    }
}

function saveFact() {
    if (!currentFact) return;
    if (state.savedFacts.includes(currentFact)) {
        showToast('Curiosidade já salva!', 'info');
        return;
    }
    state.savedFacts.push(currentFact);
    saveState();
    renderSavedFacts();
    showToast('Curiosidade salva!');
}

function renderSavedFacts() {
    const list = document.getElementById('saved-facts-list');
    const msg = document.getElementById('no-facts-msg');
    list.innerHTML = '';
    if (state.savedFacts.length === 0) {
        msg.style.display = 'block';
        return;
    }
    msg.style.display = 'none';
    state.savedFacts.forEach((fact, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${fact}</span>
            <button onclick="deleteFact(${idx})" class="btn-danger" style="padding:0.3rem 0.7rem;font-size:12px">✕</button>
        `;
        list.appendChild(li);
    });
}

window.deleteFact = (idx) => {
    state.savedFacts.splice(idx, 1);
    saveState();
    renderSavedFacts();
    showToast('Curiosidade removida', 'error');
};

// --- TAREFAS (DataTables) ---
const taskForm = document.getElementById('task-form');
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('task-input').value.trim();
    const priority = document.getElementById('task-priority').value;
    if (name) {
        state.tasks.push({ id: Date.now(), name, done: false, priority });
        saveState();
        renderTasks();
        taskForm.reset();
        showToast('Tarefa adicionada!');
    }
});

function renderTasks() {
    if ($.fn.DataTable.isDataTable('#task-table')) {
        $('#task-table').DataTable().destroy();
    }
    const tbody = document.getElementById('task-tbody');
    tbody.innerHTML = '';

    const priorityColors = { alta: '#ef233c', media: '#f4a261', baixa: '#2a9d8f' };
    const priorityLabels = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };

    state.tasks.forEach(task => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${task.done
                ? '<span style="color:#2a9d8f;font-weight:500">✓ Concluída</span>'
                : '<span style="color:#f4a261;font-weight:500">⏳ Pendente</span>'}</td>
            <td style="text-decoration:${task.done ? 'line-through' : 'none'};color:${task.done ? 'var(--text-muted)' : 'inherit'}">${task.name}</td>
            <td><span style="background:${priorityColors[task.priority]}22;color:${priorityColors[task.priority]};padding:2px 10px;border-radius:99px;font-size:12px;font-weight:600">${priorityLabels[task.priority]}</span></td>
            <td style="display:flex;gap:6px;align-items:center">
                <button onclick="toggleTask(${task.id})" class="btn-secondary" style="padding:0.3rem 0.7rem;font-size:12px">✔</button>
                <button onclick="deleteTask(${task.id})" class="btn-danger" style="padding:0.3rem 0.7rem;font-size:12px">🗑</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    $('#task-table').DataTable({
        language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json' }
    });
}

window.toggleTask = (id) => {
    const task = state.tasks.find(t => t.id === id);
    if (task) task.done = !task.done;
    saveState();
    renderTasks();
    updateProgresso();
};

window.deleteTask = (id) => {
    state.tasks = state.tasks.filter(t => t.id !== id);
    saveState();
    renderTasks();
    updateProgresso();
    showToast('Tarefa excluída', 'error');
};

// --- REVISÃO ESPAÇADA ---
const revForm = document.getElementById('rev-form');
revForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const topic = document.getElementById('rev-topic').value.trim();
    const date = document.getElementById('rev-date').value;
    const materia = document.getElementById('rev-materia').value;
    if (topic && date) {
        state.revisions.push({ id: Date.now(), topic, date, materia });
        saveState();
        renderRevisions();
        revForm.reset();
        showToast('Revisão agendada!');
    }
});

function renderRevisions() {
    const revList = document.getElementById('rev-list');
    revList.innerHTML = '';
    document.getElementById('stat-revs').textContent = state.revisions.length;

    const sorted = [...state.revisions].sort((a, b) => a.date.localeCompare(b.date));
    sorted.forEach(rev => {
        const [y, m, d] = rev.date.split('-');
        const li = document.createElement('li');
        li.innerHTML = `
            <span>
                <strong>${rev.topic}</strong>
                ${rev.materia ? `<span class="rev-badge">${rev.materia}</span>` : ''}
            </span>
            <span style="color:var(--text-muted);font-size:13px">${d}/${m}/${y}</span>
            <button onclick="deleteRev(${rev.id})" class="btn-danger" style="padding:0.3rem 0.7rem;font-size:12px">🗑</button>
        `;
        revList.appendChild(li);
    });
}

window.deleteRev = (id) => {
    state.revisions = state.revisions.filter(r => r.id !== id);
    saveState();
    renderRevisions();
    showToast('Revisão cancelada', 'error');
};

// --- DASHBOARD ---
function updateDashboard() {
    const completed = state.tasks.filter(t => t.done).length;
    document.getElementById('stat-tasks').textContent = completed;
    document.getElementById('stat-pomo').textContent = state.completedPomos;
    document.getElementById('stat-revs').textContent = state.revisions.length;
}

// --- PROGRESSO ---
function updateProgresso() {
    const total = state.tasks.length;
    const done = state.tasks.filter(t => t.done).length;
    const taxa = total > 0 ? Math.round((done / total) * 100) : 0;
    const horas = Math.round((state.completedPomos * 25) / 60 * 10) / 10;

    document.getElementById('prog-total').textContent = total;
    document.getElementById('prog-taxa').textContent = taxa + '%';
    document.getElementById('prog-horas').textContent = horas + 'h';

    // Gráfico de barras de progresso
    const chart = document.getElementById('progress-chart');
    chart.innerHTML = '';
    const bars = [
        { label: 'Tarefas Concluídas', value: done, max: total || 1, color: '#2a9d8f' },
        { label: 'Tarefas Pendentes', value: total - done, max: total || 1, color: '#f4a261' },
        { label: 'Revisões Agendadas', value: state.revisions.length, max: Math.max(state.revisions.length, 1), color: '#4361ee' },
        { label: 'Ciclos Pomodoro', value: state.completedPomos, max: Math.max(state.completedPomos, 1), color: '#ef233c' },
    ];
    bars.forEach(bar => {
        const pct = Math.round((bar.value / bar.max) * 100);
        chart.innerHTML += `
            <div class="prog-row">
                <div class="prog-label"><span>${bar.label}</span><span>${bar.value}</span></div>
                <div class="prog-bar-bg">
                    <div class="prog-bar-fill" style="width:${pct}%;background:${bar.color}"></div>
                </div>
            </div>
        `;
    });

    // Histórico Pomodoro (DataTable)
    if ($.fn.DataTable.isDataTable('#pomo-history-table')) {
        $('#pomo-history-table').DataTable().destroy();
    }
    const tbody = document.getElementById('pomo-history-tbody');
    tbody.innerHTML = '';

    if (state.pomoHistory.length === 0) {
        // Sem dados: insere linha com 4 <td> separados (não colspan) para o DataTables não reclamar
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>—</td>
            <td style="color:var(--text-muted)">Nenhuma sessão registrada ainda</td>
            <td>—</td>
            <td>—</td>
        `;
        tbody.appendChild(tr);
    } else {
        state.pomoHistory.slice().reverse().forEach((session, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${state.pomoHistory.length - idx}</td>
                <td>${session.label}</td>
                <td>${session.duration} min</td>
                <td><span style="color:#2a9d8f;font-weight:500">✓ Concluída</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    $('#pomo-history-table').DataTable({
        language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json' },
        order: [[0, 'desc']]
    });
}

// --- POMODORO ---
let timer;
let timeLeft = 25 * 60;
let currentModeMins = 25;
let isRunning = false;
const totalTime = () => currentModeMins * 60;

const display = document.getElementById('timer-display');
const ringProgress = document.getElementById('timer-ring-progress');
const CIRCUMFERENCE = 2 * Math.PI * 80; // r=80

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // Anel de progresso
    const progress = timeLeft / totalTime();
    const offset = CIRCUMFERENCE * (1 - progress);
    ringProgress.style.strokeDashoffset = offset;
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timer);
            isRunning = false;
            if (currentModeMins === 25 || currentModeMins === 15) {
                state.completedPomos++;
                state.pomoHistory.push({
                    label: currentModeMins === 25 ? 'Sessão de Foco' : 'Pausa Longa',
                    duration: currentModeMins,
                    ts: Date.now()
                });
                saveState();
            }
            showToast(`Sessão de ${currentModeMins} min concluída! 🎉`);
            timeLeft = totalTime();
            updateTimerDisplay();
        }
    }, 1000);
}

function pauseTimer() { clearInterval(timer); isRunning = false; }
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = totalTime();
    updateTimerDisplay();
}

document.getElementById('btn-start').addEventListener('click', startTimer);
document.getElementById('btn-pause').addEventListener('click', pauseTimer);
document.getElementById('btn-reset').addEventListener('click', resetTimer);

document.querySelectorAll('.mode-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentModeMins = parseInt(tab.dataset.mins);
        resetTimer();
    });
});

// --- OCULTAR/EXIBIR SENHA ---
document.getElementById('toggle-pwd').addEventListener('click', function () {
    const pwd = document.getElementById('password');
    const icon = document.getElementById('eye-icon');
    if (pwd.type === 'password') {
        pwd.type = 'text';
        icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
    } else {
        pwd.type = 'password';
        icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    }
});

// --- DARK MODE PERSISTENTE ---
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');
const themeIcon = document.getElementById('theme-icon');

function applyTheme(isDark) {
    document.body.classList.toggle('dark-theme', isDark);
    themeLabel.textContent = isDark ? 'Tema Claro' : 'Tema Escuro';
    themeIcon.innerHTML = isDark
        ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
        : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    const configToggle = document.getElementById('config-dark-toggle');
    if (configToggle) configToggle.checked = isDark;
}

if (localStorage.getItem('theme') === 'dark') applyTheme(true);

themeToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    applyTheme(isDark);
});

// Toggle em Configurações sincroniza com o sidebar
document.getElementById('config-dark-toggle').addEventListener('change', function () {
    localStorage.setItem('theme', this.checked ? 'dark' : 'light');
    applyTheme(this.checked);
});

function syncConfigToggles() {
    document.getElementById('config-dark-toggle').checked =
        document.body.classList.contains('dark-theme');
    const cfg = JSON.parse(localStorage.getItem('pomoConfig') || '{}');
    if (cfg.focus) document.getElementById('config-pomo-mins').value = cfg.focus;
    if (cfg.breakTime) document.getElementById('config-break-mins').value = cfg.breakTime;
}

// --- CONFIGURAÇÕES ---
document.getElementById('btn-save-config').addEventListener('click', () => {
    const focus = parseInt(document.getElementById('config-pomo-mins').value);
    const breakTime = parseInt(document.getElementById('config-break-mins').value);
    localStorage.setItem('pomoConfig', JSON.stringify({ focus, breakTime }));
    // Atualiza as abas do pomodoro
    document.querySelectorAll('.mode-tab').forEach(tab => {
        const mins = parseInt(tab.dataset.mins);
        if (mins === 25) { tab.dataset.mins = focus; tab.textContent = `Foco (${focus}min)`; }
        if (mins === 5) { tab.dataset.mins = breakTime; tab.textContent = `Pausa (${breakTime}min)`; }
    });
    showToast('Configurações salvas!');
});

document.getElementById('btn-reset-data').addEventListener('click', () => {
    if (!confirm('Tem certeza? Esta ação não pode ser desfeita.')) return;
    state.tasks = [];
    state.revisions = [];
    state.completedPomos = 0;
    state.savedFacts = [];
    state.pomoHistory = [];
    saveState();
    renderTasks();
    renderRevisions();
    renderSavedFacts();
    updateProgresso();
    showToast('Dados resetados', 'error');
});

// --- AVATAR (DiceBear — segunda API) ---
let currentSeed = localStorage.getItem('userAvatarSeed') || 'StudyFlow';

function updateAvatarDisplay(seed) {
    const url = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}`;
    document.getElementById('avatar-img').src = url;
    document.getElementById('topbar-avatar').src = url;
    document.getElementById('avatar-seed').value = seed;
}

document.getElementById('btn-gen-avatar').addEventListener('click', () => {
    const newSeed = document.getElementById('avatar-seed').value.trim();
    if (newSeed) {
        currentSeed = newSeed;
        updateAvatarDisplay(currentSeed);
        document.getElementById('topbar-username').textContent = newSeed;
    }
});

document.getElementById('btn-save-avatar').addEventListener('click', () => {
    localStorage.setItem('userAvatarSeed', currentSeed);
    localStorage.setItem('userName', currentSeed);
    showToast('Avatar salvo!');
});

// --- RODAPÉ ---
function setFooterDate() {
    const d = new Date();
    document.getElementById('footer-date').textContent =
        d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

// --- INICIALIZAÇÃO AUTOMÁTICA (evita reset no F5) ---
function checkLoginOnLoad() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        loginView.classList.add('hidden');
        appView.classList.remove('hidden');
        const savedName = localStorage.getItem('userName');
        if (savedName) {
            currentSeed = savedName;
            document.getElementById('topbar-username').textContent = savedName;
        }
        initApp();
    }
}

checkLoginOnLoad();
updateTimerDisplay();
