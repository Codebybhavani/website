// ── STATE ──────────────────────────────────────────────────────────────────
let questions = JSON.parse(localStorage.getItem('questions')) || [];
let currentUser = null;

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

async function login() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
        currentUser = data.user;
        setLogout(true);
        toast(`Welcome ${data.user.name}`);

        if (data.user.role === 'senior') {
            showSeniorDashboard();
        } else {
            showJuniorDashboard();
        }
    } else {
        toast('Login failed', '#dc2626');
    }
}

// ── DASHBOARDS ─────────────────────────────────────────────────────────────
function showSeniorDashboard() {
    hideAllSections();
    document.getElementById('senior-dashboard').classList.remove('hidden');

    document.getElementById('add-item-form').classList.remove('hidden');
    document.getElementById('answer-questions').classList.add('hidden');
}
function showJuniorDashboard() {
    console.log("Junior dashboard triggered"); // DEBUG

    hideAllSections();

    const dash = document.getElementById('junior-dashboard');
    if (!dash) {
        console.error("❌ junior-dashboard not found");
        return;
    }

    dash.classList.remove('hidden');

    // force visible panels
    document.getElementById('items-list').classList.remove('hidden');
    document.getElementById('ask-question-form').classList.add('hidden');
    document.getElementById('answered-questions').classList.add('hidden');

    renderJuniorItems();
}
// ── SENIOR TABS ────────────────────────────────────────────────────────────
function showAddItemForm() {
    document.getElementById('add-item-form').classList.remove('hidden');
    document.getElementById('answer-questions').classList.add('hidden');
}

function showAnswerQuestions() {
    document.getElementById('add-item-form').classList.add('hidden');
    document.getElementById('answer-questions').classList.remove('hidden');

    renderQuestions();
}

// ── JUNIOR TABS ────────────────────────────────────────────────────────────
function showItemsList() {
    document.getElementById('items-list').classList.remove('hidden');
    document.getElementById('ask-question-form').classList.add('hidden');
    document.getElementById('answered-questions').classList.add('hidden');

    renderJuniorItems();
}

function showAskQuestionForm() {
    document.getElementById('items-list').classList.add('hidden');
    document.getElementById('ask-question-form').classList.remove('hidden');
    document.getElementById('answered-questions').classList.add('hidden');
}

function showAnsweredQuestions() {
    document.getElementById('items-list').classList.add('hidden');
    document.getElementById('ask-question-form').classList.add('hidden');
    document.getElementById('answered-questions').classList.remove('hidden');

    renderAnsweredQuestions();
}

// ── ITEMS ─────────────────────────────────────────────────────────────────
async function addItem(e) {
    e.preventDefault();

    const name = document.getElementById('item-name').value;
    const price = document.getElementById('item-price').value;
    const fileInput = document.getElementById('item-image');

    if (!fileInput.files.length) {
        toast('Please select image', '#dc2626');
        return;
    }

    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('user_id', currentUser.user_id);
    formData.append('item_name', name);
    formData.append('price', price);
    formData.append('image', file);

    try {
        const res = await fetch('/items/add', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (data.success) {
            toast('Item added!');
            showItemsList();
        } else {
            toast('Error adding item', '#dc2626');
        }
    } catch (err) {
        console.error(err);
        toast('Server error', '#dc2626');
    }
}
async function renderJuniorItems() {
    const container = document.getElementById('items-container');

    if (!container) {
        console.error("❌ items-container not found");
        return;
    }

    container.innerHTML = "Loading...";

    try {
        const res = await fetch('/items/all');
        const items = await res.json();

        console.log("Items:", items);

        if (!items.length) {
            container.innerHTML = "<p>No items available</p>";
            return;
        }

        container.innerHTML = "";

       items.forEach(item => {
    container.innerHTML += `
        <div class="item-card">
            <img src="/uploads/${item.image_path}" width="150"/>
            <h3>${item.item_name}</h3>
            <p>₹${item.price}</p>

            <button class="btn btn-primary buy-btn"
                onclick="buyItem(${item.item_id}, '${item.name}', '${item.phone}')">
                Connect & Buy
            </button>
        </div>
    `;
});

    } catch (err) {
        console.error(err);
        container.innerHTML = "<p>Error loading items</p>";
    }
}

// ── Q&A ───────────────────────────────────────────────────────────────────
function askQuestion() {
    const text = document.getElementById('question-text').value.trim();
    if (!text) return;

    questions.push({ text, answered: false, answer: '' });
    localStorage.setItem('questions', JSON.stringify(questions));

    toast('Question added');
}

function renderQuestions() {
    const container = document.getElementById('questions-list');
    container.innerHTML = '';

    const unanswered = questions.filter(q => !q.answered);

    if (!unanswered.length) {
        container.innerHTML = '<p>No questions yet</p>';
        return;
    }

    unanswered.forEach((q, i) => {
        container.innerHTML += `
            <div>
                <p>${q.text}</p>
                <textarea id="ans-${i}"></textarea>
                <button onclick="answerQuestion(${i})">Answer</button>
            </div>
        `;
    });
}

function answerQuestion(i) {
    const ans = document.getElementById(`ans-${i}`).value;

    questions[i].answered = true;
    questions[i].answer = ans;

    localStorage.setItem('questions', JSON.stringify(questions));

    renderQuestions();
    toast('Answered');
}

function renderAnsweredQuestions() {
    const container = document.getElementById('answered-questions-list');
    container.innerHTML = '';

    const answered = questions.filter(q => q.answered);

    answered.forEach(q => {
        container.innerHTML += `
            <div>
                <p>${q.text}</p>
                <p>${q.answer}</p>
            </div>
        `;
    });
}
async function buyItem(itemId, sellerName, phone) {

    // Show details popup
    alert(`Contact Senior:\nName: ${sellerName}\nPhone: ${phone}`);

    // Remove item from DB
    const res = await fetch(`/items/buy/${itemId}`, {
        method: 'DELETE'
    });

    const data = await res.json();

    if (data.success) {
        toast("Item purchased!");
        renderJuniorItems(); // refresh list
    } else {
        toast("Error buying item", "#dc2626");
    }
}