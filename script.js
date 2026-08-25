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
  } else {
    message.style.background = "#10233d";
    message.style.color = "#9eeeff";
  }

  message.textContent = text;

  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

function sendMessage() {
  const text = input.value.trim();

  if (!text) return;

  addMessage(text, "user");

  input.value = "";

  // Temporary response.
  // We will connect the real AI here later.
  setTimeout(() => {
    addMessage(
      "I'm Cybro. My AI brain isn't connected yet, but we're building it.",
      "cybro"
    );
  }, 500);
}

sendButton.addEventListener("click", sendMessage);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

micButton.addEventListener("click", () => {
  addMessage(
    "Voice control will be connected in the next stage.",
    "cybro"
  );
});
