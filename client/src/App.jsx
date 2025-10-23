import { useEffect, useState } from 'react';
import { io } from "socket.io-client";

// Create socket outside component to maintain single instance
const socket = io("http://localhost:3000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Store received messages
  const [socketId, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
      console.log("Socket ID:", socket.id);
    });

    socket.on("welcome", (message) => {
      console.log(message);
    });

    // Listen for incoming messages
    socket.on("message", (data) => {
      console.log("Message received:", data);
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    socket.emit("message", message);
    console.log("Message to send:", message);
    setMessage(""); // Clear input after sending
  }

  const joinRoomHandle = (event) => {
    event.preventDefault();
    socket.emit('join-room', roomName);
    setRoomName(""); // Clear input after joining
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>WebSocket Client</h1>

      <form onSubmit={joinRoomHandle}>
        <h5>Join Room</h5>
         <input 
          type="text"
          value={roomName} 
          onChange={(e) => setRoomName(e.target.value)} 
          placeholder="Type a message"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }}
        />
        <button 
          type="submit"
          style={{
            marginTop: '16px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Join
        </button>
      </form>

      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type a message"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }}
        />
        <button 
          type="submit"
          style={{
            marginTop: '16px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </form>

      <p>Open the console to see messages from the server.</p>
      
      {/* Display received messages */}
      <div style={{ marginTop: '20px' }}>
        <h3>Messages:</h3>
        {messages.map((msg, index) => (
          <div key={index} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
            <strong>{msg.id}:</strong> {msg.message}
            <small style={{ marginLeft: '10px', color: '#666' }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;