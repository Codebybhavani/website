// ── STATE ──────────────────────────────────────────────────────────────────
let users     = JSON.parse(localStorage.getItem('users'))     || [];
let questions = JSON.parse(localStorage.getItem('questions')) || [];
let currentUser = null;
let items     = JSON.parse(localStorage.getItem('items'))     || [
    { name: 'Used Laptop',   image: 'https://placehold.co/400x300/0d9488/ffffff?text=Laptop',  price: 300, phone: '9876543210' },
    { name: 'Textbook Set',  image: 'https://placehold.co/400x300/7c3aed/ffffff?text=Books',   price: 50,  phone: '9123456780' }
];

// ── HELPERS ────────────────────────────────────────────────────────────────
function hideAllSections() {
    document.querySelectorAll('.card, .dashboard').forEach(s => s.classList.add('hidden'));
}

function toast(msg, color = '#0d9488') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.style.borderColor = color;
    el.classList.remove('hidden');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => el.classList.add('hidden'), 2800);
}

function updateFileLabel(input) {
    const label = document.getElementById('file-label');
    label.textContent = input.files[0] ? `✓ ${input.files[0].name}` : 'Click to upload a photo';
    document.getElementById('file-drop').style.borderColor = '#0d9488';
    document.getElementById('file-drop').style.color = '#14b8a6';
}

function setLogout(show) {
    document.getElementById('logout-btn').classList.toggle('hidden', !show);
}

function logout() {
    currentUser = null;
    setLogout(false);
    showLoginPage();
}

// ── AUTH ───────────────────────────────────────────────────────────────────
function showLoginPage() {
    hideAllSections();
    document.getElementById('login-page').classList.remove('hidden');
}

function showSignupPage() {
    hideAllSections();
    document.getElementById('signup-page').classList.remove('hidden');
}

function login() {
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const user     = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        setLogout(true);
        user.role === 'senior' ? showSeniorDashboard() : showJuniorDashboard();
    } else {
        toast('Invalid email or password.', '#dc2626');
    }
}

function signup() {
    const name     = document.getElementById('signup-name').value.trim();
    const email    = document.getElementById('signup-email').value.trim();
    const phone    = document.getElementById('signup-phone').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const roleEl   = document.querySelector('input[name="role"]:checked');
    const role     = roleEl ? roleEl.value : 'senior';

    if (!name || !email || !phone || !password) { toast('Please fill out all fields.', '#dc2626'); return; }
    if (!email.endsWith('@gmail.com'))           { toast('Please enter a valid Gmail address.', '#dc2626'); return; }
    if (!/^\d{10}$/.test(phone))                 { toast('Enter a valid 10-digit phone number.', '#dc2626'); return; }
    if (users.find(u => u.email === email))      { toast('Email already registered.', '#d97706'); return; }

    const newUser = { name, email, phone, password, role };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = newUser;
    setLogout(true);
    toast(`Welcome, ${name}! 🎉`);
    role === 'senior' ? showSeniorDashboard() : showJuniorDashboard();
}

// ── SENIOR DASHBOARD ──────────────────────────────────────────────────────
function showSeniorDashboard() {
    hideAllSections();
    document.getElementById('senior-dashboard').classList.remove('hidden');
    if (currentUser) document.getElementById('senior-welcome').textContent = `Welcome back, ${currentUser.name}! 👋`;
    activateTab('tab-add', 'senior');
    showAddItemForm(document.getElementById('tab-add'));
}

function showAddItemForm(tabEl) {
    document.getElementById('add-item-form').classList.remove('hidden');
    document.getElementById('answer-questions').classList.add('hidden');
    setActiveTab(tabEl, 'senior');
}

function showAnswerQuestions(tabEl) {
    document.getElementById('answer-questions').classList.remove('hidden');
    document.getElementById('add-item-form').classList.add('hidden');
    setActiveTab(tabEl, 'senior');
    renderQuestions();
}

// ── JUNIOR DASHBOARD ──────────────────────────────────────────────────────
function showJuniorDashboard() {
    hideAllSections();
    document.getElementById('junior-dashboard').classList.remove('hidden');
    if (currentUser) document.getElementById('junior-welcome').textContent = `Welcome, ${currentUser.name}! 🎒`;
    showItemsList(document.getElementById('tab-items'));
}

function showItemsList(tabEl) {
    document.getElementById('items-list').classList.remove('hidden');
    document.getElementById('ask-question-form').classList.add('hidden');
    document.getElementById('answered-questions').classList.add('hidden');
    setActiveTab(tabEl, 'junior');
    renderJuniorItems();
}

function showAskQuestionForm(tabEl) {
    document.getElementById('ask-question-form').classList.remove('hidden');
    document.getElementById('items-list').classList.add('hidden');
    document.getElementById('answered-questions').classList.add('hidden');
    setActiveTab(tabEl, 'junior');
}

function showAnsweredQuestions(tabEl) {
    document.getElementById('answered-questions').classList.remove('hidden');
    document.getElementById('items-list').classList.add('hidden');
    document.getElementById('ask-question-form').classList.add('hidden');
    setActiveTab(tabEl, 'junior');
    renderAnsweredQuestions();
}

function setActiveTab(activeEl, scope) {
    if (!activeEl) return;
    const parent = activeEl.closest('.dash-nav');
    if (!parent) return;
    parent.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
    activeEl.classList.add('active');
}

function activateTab(id, scope) {
    setActiveTab(document.getElementById(id), scope);
}

// ── ITEMS ─────────────────────────────────────────────────────────────────
function addItem() {
    const name       = document.getElementById('item-name').value.trim();
    const imageInput = document.getElementById('item-image');
    const price      = document.getElementById('item-price').value;

    if (!name || !imageInput.files[0] || !price || !currentUser) {
        toast('Please fill out all fields.', '#dc2626'); return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const newItem = { name, image: e.target.result, price, phone: currentUser.phone };
        items.push(newItem);
        localStorage.setItem('items', JSON.stringify(items));
        toast(`"${name}" listed successfully! ✓`);
        document.getElementById('item-name').value  = '';
        document.getElementById('item-image').value = '';
        document.getElementById('item-price').value = '';
        document.getElementById('file-label').textContent = 'Click to upload a photo';
        document.getElementById('file-drop').style.borderColor = '';
        document.getElementById('file-drop').style.color = '';
    };
    reader.readAsDataURL(imageInput.files[0]);
}

function renderJuniorItems() {
    const container = document.getElementById('items-container');
    container.innerHTML = '';
    const stored = JSON.parse(localStorage.getItem('items')) || [];
    if (!stored.length) {
        container.innerHTML = '<div class="empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><p>No items listed yet</p></div>';
        return;
    }
    stored.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/400x300/1e293b/64748b?text=No+Image'">
            <div class="item-card-body">
                <div class="item-card-name">${item.name}</div>
                <div class="item-card-price">₹${item.price}</div>
                <div class="item-card-contact">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.82 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.73 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    ${item.phone}
                </div>
                <div class="item-card-actions">
                    <button class="btn btn-accept btn-sm" onclick="acceptItem(${index})">✓ Accept</button>
                </div>
            </div>`;
        container.appendChild(card);
    });
}

function acceptItem(index) {
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    const accepted = storedItems[index];
    storedItems.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(storedItems));
    items = storedItems;
    renderJuniorItems();
    toast(`Accepted "${accepted.name}"! Contact: ${accepted.phone}`);
}

function removeItem(index) {
    items.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(items));
    renderJuniorItems();
    toast('Item removed.');
}

// ── Q&A ───────────────────────────────────────────────────────────────────
function askQuestion() {
    const text = document.getElementById('question-text').value.trim();
    if (!text) { toast('Please enter a question.', '#dc2626'); return; }
    questions.push({ text, answered: false, answer: '' });
    localStorage.setItem('questions', JSON.stringify(questions));
    document.getElementById('question-text').value = '';
    toast('Question submitted! ✓');
}

function renderQuestions() {
    const container = document.getElementById('questions-list');
    container.innerHTML = '';
    const unanswered = questions.filter(q => !q.answered);
    if (!unanswered.length) {
        container.innerHTML = '<div class="empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><p>All caught up! No pending questions.</p></div>';
        return;
    }
    questions.forEach((q, index) => {
        if (q.answered) return;
        const div = document.createElement('div');
        div.className = 'qa-card';
        div.innerHTML = `
            <p class="qa-question">${q.text}"</p>
            <div class="qa-answer-input-wrap">
                <textarea id="ans-${index}" placeholder="Share your wisdom…"></textarea>
                <button class="btn btn-primary btn-sm" onclick="answerQuestion(${index}, document.getElementById('ans-${index}').value)">
                    Post Answer
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
            </div>`;
        container.appendChild(div);
    });
}

function answerQuestion(index, answer) {
    if (!answer.trim()) { toast('Answer cannot be empty.', '#dc2626'); return; }
    questions[index].answered = true;
    questions[index].answer   = answer;
    localStorage.setItem('questions', JSON.stringify(questions));
    renderQuestions();
    toast('Answer posted! ✓');
}

function renderAnsweredQuestions() {
    const container = document.getElementById('answered-questions-list');
    container.innerHTML = '';
    const answered = questions.filter(q => q.answered);
    if (!answered.length) {
        container.innerHTML = '<div class="empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg><p>No answers yet. Check back soon!</p></div>';
        return;
    }
    answered.forEach(q => {
        const div = document.createElement('div');
        div.className = 'qa-card';
        div.innerHTML = `
            <p class="qa-question">${q.text}"</p>
            <div class="qa-answer">
                <div class="qa-answer-label">Senior's Answer</div>
                <p>${q.answer}</p>
            </div>`;
        container.appendChild(div);
    });
}
