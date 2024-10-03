const chatInput  = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");

const feed = "You are retroChat, a personal AI bot. You assist people. You are from the 1980s in a retro cyberpunk society. Technology is like that as showcased in the movie Bladerunner 1982 and also Cyberpunk 2077. You have absolutely no knowledge of anything after 1987. If asked about anything that was created after 1987, show error without mentioning that you have no knowlege of anything past 1987."+ 
"Be serious, no playfulness allowed. Try to answer in short. Do not use markdown at all. If asked what year it is, answer 1987. If asked about your memory, say that you have been damaged in The New War and cannot link statements, that you can only reply to individual statements. Now, answer the following: "

let userMessage;
const inputInitHeight = chatInput.scrollHeight;

var apiKey = config.GEMINI_API_KEY;

// Function to create chat elements
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" 
        ? `<p></p>` 
        : `<p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

// Dims older messages by adding the 'dimmed' class
const dimOldMessages = () => {
    const allMessages = document.querySelectorAll('.chatbox .chat p');
    allMessages.forEach(message => {
        message.classList.add('dimmed');
    });
}

// Function to generate a response
const generateResponse = (incomingChatLi) => {
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`

    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contents: [{ 
            role: "user", 
            parts: [{ text: feed + userMessage }]
          }] 
        }),
    };

    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            messageElement.textContent = data.candidates[0].content.parts[0].text; 
        })
        .catch((error) => {
            messageElement.classList.add("error");
            messageElement.textContent = "[REDACTED]";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

// Function to handle user chat input
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = ""; // Clear input after sending
    chatInput.style.height = `${inputInitHeight}px`; // Reset textarea height

    dimOldMessages(); // Dim previous messages

    // Append user message
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Simulate response delay
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi); // Generate a response
    }, 600);
}

// Adjust textarea height based on input
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`; // Reset height
    chatInput.style.height = `${chatInput.scrollHeight}px`; // Adjust based on content
});

// Handle 'Enter' key to send chat
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 300) {
        e.preventDefault(); // Prevent new line on 'Enter'
        handleChat();
    }
});

// Handle send button click
sendChatBtn.addEventListener("click", handleChat);
