import './global.css'
import { createChart, ChartData, addDataToChart } from './lib/chart'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
	<canvas id="chart"/>
`
const data: ChartData[] = [
	{
		timestamp: new Date().toLocaleTimeString(),
		data: 0,
		type: 0,
	}
]

const chart = createChart('chart', data)


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
		if(data.event == "ekg-changes") {
			const newValue: ChartData = {
				timestamp: new Date(data.data.timestamp).toLocaleTimeString(),
				data: data.data.value,
				type: 0
			}
			addDataToChart(chart, newValue)
		}
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

