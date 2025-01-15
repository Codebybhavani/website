
    

        let users = JSON.parse(localStorage.getItem('users')) || [];
        let questions = JSON.parse(localStorage.getItem('questions')) || [];
        
        let currentUser = null;
        let items = JSON.parse(localStorage.getItem('items')) || [
    {
        name: 'Used Laptop',
        image: 'https://via.placeholder.com/100',
        price: 300
    },
    {
        name: 'Books',
        image: 'https://via.placeholder.com/100',
        price: 50
    }
];

function showJuniorDashboard() {
    hideAllSections();
    document.getElementById('junior-dashboard').classList.remove('hidden');
    document.getElementById('login-page').classList.add('hidden');
    renderJuniorItems(); // Ensure items are displayed
}




        function showLoginPage() {
            hideAllSections();
            document.getElementById('login-page').classList.remove('hidden');
            document.getElementById('signup-page').classList.add('hidden');
        }

        function showSignupPage() {
            hideAllSections();
            document.getElementById('signup-page').classList.remove('hidden');
            document.getElementById('login-page').classList.add('hidden');
        }
        function answerQuestion(index, answer) {
            questions[index].answered = true;
            questions[index].answer = answer;
            localStorage.setItem('questions', JSON.stringify(questions));
            renderQuestions();
        }
        // After adding an item, call renderJuniorItems for juniors to see the new item
// After adding an item, call renderJuniorItems for juniors to see the new item
function addItem() {
    const name = document.getElementById('item-name').value;
    const imageInput = document.getElementById('item-image');
    const price = document.getElementById('item-price').value;

    if (!name || !imageInput.files[0] || !price || !currentUser) {
        alert('Please fill out all fields or log in as a senior.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const newItem = {
            name,
            image: e.target.result,
            price,
            phone: currentUser.phone // Include the current senior's phone number
        };

        // Add the new item to the items array
        items.push(newItem);
        localStorage.setItem('items', JSON.stringify(items)); // Store updated items in localStorage

        alert('Item added successfully.');

        // Re-render items for both Senior and Junior
        renderItems(); // Render for senior
        renderJuniorItems(); // Render for junior

        // Clear input fields
        document.getElementById('item-name').value = '';
        document.getElementById('item-image').value = '';
        document.getElementById('item-price').value = '';
    };

    reader.readAsDataURL(imageInput.files[0]);
}

// Function to render items for juniors, ensuring they see the new items added by seniors
// Function to render items for juniors, ensuring they see the new items added by seniors
function renderJuniorItems() {
    const juniorItemsContainer = document.getElementById('items-container');
    juniorItemsContainer.innerHTML = ''; // Clear any existing items

    // Reload items from localStorage
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];

    storedItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <h3>${item.name}</h3>
            <img src="${item.image}" alt="${item.name}">
            <p>Price: ${item.price}</p>
            <p><strong>Contact:</strong> ${item.phone}</p> <!-- Display the senior's phone number -->
            <button onclick="acceptItem(${index})">Accept</button>
        `;
        juniorItemsContainer.appendChild(div);
    });
}




function showJuniorDashboard() {
    console.log("Switching to Junior Dashboard");
    hideAllSections(); // Ensure all sections are hidden first
    document.getElementById('junior-dashboard').classList.remove('hidden'); // Show the junior dashboard
    document.getElementById('login-page').classList.add('hidden'); // Ensure the login page is hidden
    renderJuniorItems(); // Render items for juniors
}


// Render items in the senior dashboard (for reference)
function renderItems() {
    const seniorItemsContainer = document.getElementById('items-container');
    seniorItemsContainer.innerHTML = ''; // Clear existing items

    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
        
            
    <div style="flex: 0 0 150px; text-align: center;"> <!-- Fixed width for the image container -->
        <img src="${item.image}" alt="${item.name}" style="max-width: 100%; max-height: 100px; border-radius: 5px;">
    </div>
    <div style="flex: 1; padding-left: 15px; display: flex; flex-direction: column;"> <!-- Flexible width and column layout for details -->
        <b><p style="margin: 0; font-size: 1.2em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</p></b>
        <p style="margin: 5px 0;">Price: ${item.price}</p>
        <p style="margin: 5px 0;"><strong>Contact:</strong> ${item.phone}</p>
        <button onclick="removeItem(${index})" style="align-self: start; padding: 5px 10px; background-color: #008080; color: white; border: none; border-radius: 3px; cursor: pointer;">Accept</button>
    </div>
        
        `;
        seniorItemsContainer.appendChild(div);
    });
}

// Function to remove an item from the senior's list
function removeItem(index) {
    items.splice(index, 1); // Remove item from the array
    localStorage.setItem('items', JSON.stringify(items)); // Update localStorage
    renderItems(); // Re-render senior items
    renderJuniorItems(); // Re-render junior items to reflect the change
}

// When junior accepts an item
function acceptItem(index) {
    const acceptedItem = items[index];
    items.splice(index, 1); // Remove the item from the list
    localStorage.setItem('items', JSON.stringify(items)); // Update localStorage
    renderItems(); // Re-render items for senior
    renderJuniorItems(); // Re-render items for junior
    alert(`You have accepted the item: ${acceptedItem.name}`);
    localStorage.setItem('items', JSON.stringify(items));
}




        function login() {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                currentUser = user;
                if (user.role === 'senior') {
                    showSeniorDashboard();
                } else {
                    showJuniorDashboard();
                }
            } else {
                alert('Invalid email or password.');
            }
        }

        function signup() {
            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const phone = document.getElementById('signup-phone').value.trim();
            const password = document.getElementById('signup-password').value.trim();
            const role = document.getElementById('signup-role').value.trim();
        
            // Check if all fields are filled
            if (!name || !email || !phone || !password || !role) {
                alert('Please fill out all fields.');
                return;
            }
        
            // Check if email is valid (must include @gmail.com)
            if (!email.endsWith('@gmail.com')) {
                alert('Please enter a valid Gmail address.');
                return;
            }
        
            // Check if phone number is valid (must be 10 digits)
            if (!/^\d{10}$/.test(phone)) {
                alert('Please enter a valid 10-digit phone number.');
                return;
            }
        
            // Check if email is already registered
            if (users.find(u => u.email === email)) {
                alert('Email already registered.');
                return;
            }
        
            // Add the new user to the users array
            const newUser = { name, email, phone, password, role };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
        
            // Log the user in automatically
            currentUser = newUser;
        
            // Redirect to the appropriate dashboard
            if (role === 'senior') {
                showSeniorDashboard();
            } else {
                showJuniorDashboard();
            }
        }
        
        function showSeniorDashboard() {
            hideAllSections();
            document.getElementById('senior-dashboard').classList.remove('hidden');
            document.getElementById('login-page').classList.add('hidden');
        }

        

        function showAddItemForm() {
            document.getElementById('add-item-form').classList.remove('hidden');
            document.getElementById('answer-questions').classList.add('hidden');
        }

        function showAnsweredQuestions() {
           
    // Show the answered questions section
    document.getElementById('answered-questions').classList.remove('hidden');

    // Hide other sections of the dashboard
    document.getElementById('ask-question-form').classList.add('hidden');
    document.getElementById('items-list').classList.add('hidden');
    
    console.log('Button clicked, showing answered questions...');
    console.log('Questions array:', questions); // Debugging output
    renderAnsweredQuestions();
        }


    // Render the answered questions

        function showAskQuestionForm() {
            document.getElementById('ask-question-form').classList.remove('hidden');
            document.getElementById('items-list').classList.add('hidden');
        }

        function showItemsList() {
            document.getElementById('items-list').classList.remove('hidden');
            document.getElementById('ask-question-form').classList.add('hidden');
            renderItems();
        }

        function askQuestion() {
            const questionText = document.getElementById('question-text').value.trim(); // Trim to remove extra spaces
        
            if (questionText === '') {
                alert(' The question field cannot be empty. Please enter a question.');
                return; // Stop further execution
            }
        
            questions.push({ text: questionText, answered: false, answer: '' });
            localStorage.setItem('questions', JSON.stringify(questions));
            alert('Question asked successfully.');
            document.getElementById('question-text').value = ''; // Clear the field
        }
        
        function showAnswerQuestions() {
            document.getElementById('answer-questions').classList.remove('hidden');
            document.getElementById('add-item-form').classList.add('hidden');
            renderQuestions();
        }
        function renderQuestions() {
            const container = document.getElementById('questions-list');
            container.innerHTML = '';
            questions.forEach((q, index) => {
                const div = document.createElement('div');
                div.className = 'question';
                div.innerHTML = `<p>${q.text}</p>`;
                if (!q.answered) {
                    const input = document.createElement('textarea');
                    input.placeholder = 'Your answer';
                    const button = document.createElement('button');
                    button.textContent = 'Answer';
                    button.onclick = () => answerQuestion(index, input.value);
                    div.appendChild(input);
                    div.appendChild(button);
                } else {
                    div.innerHTML += `<p><strong>Answer:</strong> ${q.answer}</p>`;
                }
                container.appendChild(div);
            });
        }

        function answerQuestion(index, answer) {
            questions[index].answered = true;
            questions[index].answer = answer;
            localStorage.setItem('questions', JSON.stringify(questions));
            renderQuestions();
        }
function renderAnsweredQuestions() {
    const container = document.getElementById('answered-questions-list');
    container.innerHTML = ''; // Clear previous content

    questions.forEach(q => {
        if (q.answered) {
            const div = document.createElement('div');
            div.className = 'qa-box';
            div.innerHTML = `
                <div class="question-box">
                    <strong>Question:</strong>
                    <p>${q.text}</p>
                </div>
                <div class="answer-box">
                    <strong>Answer:</strong>
                    <p>${q.answer}</p>
                </div>
            `;
            container.appendChild(div);
        }
    });
}

function hideAllSections() {
    console.log("Hiding all sections...");
    const sections = document.querySelectorAll('.container');
    sections.forEach(section => {
        console.log(`Hiding section: ${section.id}`);
        section.classList.add('hidden');
    });
}




function fetchQuestions() {
    fetch('http://localhost:3000/questions')
        .then(response => response.json())
        .then(fetchedQuestions => {
            questions = fetchedQuestions; // Update local questions array
            renderAnsweredQuestions();
        });
}



    
