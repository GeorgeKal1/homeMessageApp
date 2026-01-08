import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import fs from "fs";  
import path from "path";

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const DATA_FILE = "chat_history.json";

let messages = []; 

try {
 
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    messages = JSON.parse(data); 
    console.log("Φορτώθηκαν", messages.length, "παλιά μηνύματα.");
  }
} catch (err) {
  console.error("Σφάλμα κατά τη φόρτωση των μηνυμάτων:", err);
  messages = []; 
}

function saveMessagesToFile() {
  fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2), (err) => {
    if (err) console.error("Δεν μπόρεσα να αποθηκεύσω τα μηνύματα!", err);
  });
}

io.on("connection", (socket) => {
  console.log("Χρήστης συνδέθηκε:", socket.id);

  socket.emit("initialMessages", messages);

  socket.on("sendMessage", (msg) => {
    messages.push(msg);

    saveMessagesToFile();

    io.emit("newMessage", msg);
  });

  
});

server.listen(3001, "0.0.0.0", () => {
  console.log("Server running on port 3001");
});