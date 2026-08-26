const input = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const micButton = document.getElementById("micButton");
const chat = document.getElementById("chat");

function addMessage(text, sender) {
  const message = document.createElement("div");

  message.style.margin = "15px 0";
  message.style.padding = "14px";
  message.style.borderRadius = "15px";
  message.style.maxWidth = "80%";
  message.style.whiteSpace = "pre-wrap";

  if (sender === "user") {
    message.style.marginLeft = "auto";
    message.style.background = "#0077ff";
    message.style.color = "white";
  } else {
    message.style.background = "#10233d";
    message.style.color = "#9eeeff";
  }

  message.textContent = text;

  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-IN";
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

async function cybroReply(text) {
  addMessage("Thinking...", "cybro");

  try {
    const response = await fetch(
  "https://cybro-ai.vercel.app/api/chat",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: text
    })
  }
);

    const data = await response.json();

    // Remove the temporary "Thinking..." message
    const messages = chat.children;
    if (messages.length > 0) {
      messages[messages.length - 1].remove();
    }

    if (!response.ok) {
      throw new Error(data.error || "AI request failed");
    }

    const reply = data.reply || "I couldn't generate a response.";

    addMessage(reply, "cybro");
    speak(reply);

  } catch (error) {
    console.error(error);

    const messages = chat.children;
    if (messages.length > 0) {
      messages[messages.length - 1].remove();
    }

    const errorMessage =
      "Sorry, I couldn't connect to my AI brain.";

    addMessage(errorMessage, "cybro");
    speak(errorMessage);
  }
}

function sendMessage() {
  const text = input.value.trim();

  if (!text) return;

  addMessage(text, "user");

  input.value = "";

  cybroReply(text);
}

sendButton.addEventListener("click", sendMessage);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});


// ----------------------------
// VOICE RECOGNITION
// ----------------------------

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

if (SpeechRecognition) {

  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;

  // We will improve Hindi/English detection later.
  recognition.lang = "en-IN";

  recognition.onstart = () => {
    micButton.textContent = "🔴";
  };

  recognition.onend = () => {
    micButton.textContent = "🎙️";
  };

  recognition.onerror = (event) => {
    console.log("Voice error:", event.error);
    micButton.textContent = "🎙️";
  };

  recognition.onresult = (event) => {

    const transcript =
      event.results[0][0].transcript;

    input.value = transcript;

    sendMessage();
  };

  micButton.addEventListener("click", () => {
    recognition.start();
  });

} else {

  micButton.addEventListener("click", () => {

    alert(
      "Voice recognition is not supported in this browser."
    );

  });

    }
