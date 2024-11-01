// Replace this URL with the URL of your WebSocket server
const socketUrl = "http://127.0.0.1:3001/ws";

const socket = new WebSocket(socketUrl);

// Log connection status
socket.onopen = () => {
    console.log("Connected to the WebSocket server");
};

// Handle messages from the server
socket.onmessage = (event) => {
    try {
        // Parse the JSON data received from the server
        const data = JSON.parse(event.data);
        console.log("Received data:", data);
    } catch (error) {
        console.error("Error parsing JSON:", error);
    }
};

// Log disconnection status
socket.onclose = () => {
    console.log("Disconnected from the WebSocket server");
};

// Log errors
socket.onerror = (error) => {
    console.error("WebSocket error:", error);
};

