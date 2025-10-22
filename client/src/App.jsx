import { useEffect } from 'react';
import { io } from "socket.io-client";

function App() {
  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("Connected to server");
      console.log("Socket ID:", socket.id);
    });

    socket.on("welcome", (message) => {
      console.log(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>App</div>
  );
}

export default App;
