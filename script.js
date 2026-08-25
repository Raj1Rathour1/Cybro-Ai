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

function cybroReply(text) {
  const reply =
    "I heard you say: " + text +
    ". My AI brain will be connected next.";

  addMessage(reply, "cybro");
  speak(reply);
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
