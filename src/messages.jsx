function Messages({ data, currentUser }) {
  let user = "Άγνωστος";
  let text = "";

  // Έλεγχος: Τι είδους δεδομένα λάβαμε;
  if (typeof data === "string") {
    // Περίπτωση 1: Παλιό μήνυμα (σκέτο κείμενο)
    text = data;
  } else if (typeof data === "object" && data !== null) {
    // Περίπτωση 2: Καινούργιο μήνυμα (αντικείμενο {user, text})
    user = data.user || "Άγνωστος";
    text = data.text || "";
  }

  // Έλεγχος αν το μήνυμα είναι δικό μας
  const isMe = user === currentUser;

  return (
    <li className={`message-bubble ${isMe ? "my-message" : ""}`}>
      <span className="msg-user">{user}</span>
      <span className="msg-text">{text}</span>
    </li>
  );
}

export default Messages;