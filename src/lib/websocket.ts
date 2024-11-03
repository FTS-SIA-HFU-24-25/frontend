import Chart from "chart.js/auto"
import { addDataToChart } from "./chart.ts"

const lastUpdate = document.getElementById("last-update")
const heartbeat = document.getElementById('heartbeat')
const connectionRate = document.getElementById("connection-rate")

export function createWebSocket(chart: Chart<"line", any, unknown>) {
    // Replace this URL with the URL of your WebSocket server
    const socketUrl = "http://127.0.0.1:3001/ws";

    const socket = new WebSocket(socketUrl);
    let startTime: number = Date.now();
    let intv: number = 0;

    // Log connection status
    socket.onopen = () => {
        console.log("Connected to the WebSocket server");
        intv = setInterval(measureLatency, 3000)
    };

    // Handle messages from the server
    socket.onmessage = (event) => {
        try {
            // Parse the JSON data received from the server
            const data = JSON.parse(event.data);
            if(data.event == "ekg-changes" ) {
                addDataToChart(chart, {
                    timestamp: new Date(data.data.timestamp).toLocaleTimeString(),
                    data: data.data.value,
                    type: 0,
                })
            } else {
                console.log(data)
            }
            if(data.event == "heartbeat" && heartbeat) {
                heartbeat.innerHTML = `
                    Durchscnittliche Herzfrequenz: ${data.data.avg} BPM
                `
            }
            if(data.event == "pong" && connectionRate) {
                        const latency = Date.now() - startTime;
                connectionRate.innerHTML = `
                   ${latency}ms - Internet Verbindung 
`
            }
            lastUpdate!.innerHTML = `
                Letzte Aktualisierung: ${new Date(data.data.timestamp).toLocaleString()}
            `
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    };

    // Log disconnection status
    socket.onclose = () => {
        console.log("Disconnected from the WebSocket server");
        connectionRate!.innerHTML = `
            Verbindung abgebrochen
`
            clearInterval(intv)
    };

    // Log errors
    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        connectionRate!.innerHTML = `
            Verbindung abgebrochen
`
            clearInterval(intv)
    };

    function measureLatency() {
        startTime = Date.now();
        socket.send(JSON.stringify({
            event: 1,
            data: startTime,
        }));
    }
}

