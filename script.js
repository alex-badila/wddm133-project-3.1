// Chatbot logic for MindfulU
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Resources database
const resources = {
    stress: [
        "The Calm app offers guided meditations specifically for stress relief.",
        "Try deep breathing exercises: inhale for 4 counts, hold for 4, exhale for 4.",
        "Your university's counseling center can provide personalized stress management strategies."
    ],
    anxiety: [
        "Headspace has anxiety-focused sessions that are great for students.",
        "Practice grounding techniques: name 5 things you can see, 4 you can touch, etc.",
        "Consider talking to a campus counselor about anxiety management."
    ],
    depression: [
        "The Insight Timer app has free meditations for mood improvement.",
        "Regular exercise and sunlight exposure can help with depressive symptoms.",
        "Please reach out to mental health professionals - you're not alone in this."
    ],
    sleep: [
        "Establish a consistent sleep schedule, even on weekends.",
        "Avoid screens 1 hour before bed and try relaxation techniques.",
        "If sleep issues persist, consult your university health services."
    ],
    general: [
        "Remember, it's okay to ask for help. Your well-being matters.",
        "Active Minds (activeminds.org) is a great resource for student mental health.",
        "National Alliance on Mental Illness (NAMI) has excellent support resources."
    ],
    crisis: [
        "If you're in immediate danger, please call emergency services (911) or go to the nearest emergency room.",
        "For crisis support, call the 988 Suicide & Crisis Lifeline - they're available 24/7.",
        "Text HOME to 741741 for the Crisis Text Line.",
        "Please seek immediate professional help - your safety is the top priority."
    ]
};

// Function to detect crisis keywords
function detectCrisis(message) {
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'not worth living', 'harm myself', 'die', 'death'];
    return crisisKeywords.some(keyword => message.toLowerCase().includes(keyword));
}

// Function to get relevant resources
function getResources(message) {
    const lowerMessage = message.toLowerCase();

    if (detectCrisis(message)) {
        return resources.crisis;
    }

    if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelm')) {
        return resources.stress;
    }

    if (lowerMessage.includes('anxiety') || lowerMessage.includes('worried') || lowerMessage.includes('panic')) {
        return resources.anxiety;
    }

    if (lowerMessage.includes('depress') || lowerMessage.includes('sad') || lowerMessage.includes('down')) {
        return resources.depression;
    }

    if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia')) {
        return resources.sleep;
    }

    return resources.general;
}

// Function to generate bot response
function generateResponse(userMessage) {
    const relevantResources = getResources(userMessage);

    let response = "I hear you. ";

    if (detectCrisis(userMessage)) {
        response += "I'm concerned about what you're sharing. ";
    } else {
        response += "It's completely normal to feel this way, especially as a university student. ";
    }

    response += "Here are some resources that might help:\n\n";
    response += relevantResources.join('\n\n');
    response += "\n\nRemember, I'm here to listen, but for personalized support, please consider reaching out to a mental health professional.";

    return response;
}

// Function to add message to chat
function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to handle sending message
function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';

    // Simulate typing delay
    sendButton.disabled = true;
    setTimeout(() => {
        const botResponse = generateResponse(message);
        addMessage(botResponse, 'bot');
        sendButton.disabled = false;
    }, 1000);
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Initial bot message
setTimeout(() => {
    addMessage("Hi! I'm MindfulU, your mental health companion. How are you feeling today? I'm here to listen and recommend resources to support your well-being.", 'bot');
}, 500);

// PWA Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}