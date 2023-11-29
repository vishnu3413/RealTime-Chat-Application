const socket = io({ transports: ["websocket"] });

const form = document.getElementById("send-container");
const messageinput = document.getElementById("messageinp");
const messagecontainer = document.querySelector(".container");

var audio = new Audio("tone.mp3");
const append = (message, position) => {
  const messageelement = document.createElement("div");
  messageelement.innerText = message;
  messageelement.classList.add("message");
  messageelement.classList.add(position);
  messagecontainer.append(messageelement);
  if (position == "left") {
    audio.play();
    document.title = "New Message!";
    setTimeout(() => {
      document.title = "RealTime Chat-Application";
    }, 5000);
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageinput.value;
  append(`You: ${message}`, "right");
  socket.emit("send", message);
  messageinput.value = "";
});

const name = prompt("Enter your name");
socket.emit("new-user-joined", name);

socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "left");
});
socket.on("receive", (data) => {
  console.log("Recieved");
  append(`${data.name}:${data.message}`, "left");
});
socket.on("left", (name) => {
  append(`${name} left the chat`, "left");
});
