import Chart from "chart.js/auto"
import { addDataToChart } from "./chart.ts"
import { EcgWSEvent, SpectrumWSEvent } from "./types.ts"
import { generateConfig, createListener, Config } from "./config.ts"

const heartbeat = document.getElementById('heartbeat')
const connectionRate = document.getElementById("connection-rate")

export function createWebSocket(chart: Chart<"line", any, unknown>, hb: Chart<"line", any, unknown>, spectrum: Chart<"line", any, unknown>): WebSocket {
    // Replace this URL with the URL of your WebSocket server
    const socketUrl = "ws://127.0.0.1:3001/ws";

    const socket = new WebSocket(socketUrl);
    let startTime: number = Date.now();
    let intv: number = 0;

    // Log connection status
    socket.onopen = () => {
        console.log("Connected to the WebSocket server");
        measureLatency()
        generateConfig({
          "chunks_size": 10,
          "start_receive_data": 0,
          "filter_type": 0,
          "max_pass": 0,
          "min_pass": 0,
          "spectrum_update_request": 0
        })
        createListener(socket) 
        intv = setInterval(measureLatency, 3000)
        const localConf: Config = JSON.parse(localStorage.getItem("config") || "{}");
        if (localConf.chunks_size) {
            socket.send(JSON.stringify({ event: 4, data: JSON.stringify(localConf) }));
        }
    };

    // Handle messages from the server
    socket.onmessage = (event) => {
        try {
            // Parse the JSON data received from the server
            const data = JSON.parse(event.data);
            console.log(data)
            if(data.event == "ekg-changes" ) {
                const ecg: EcgWSEvent = data.data
                addDataToChart(chart, ecg.signals)
                if(chart.data.datasets[0].data.length%100 == 0){
                    addDataToChart(hb, [ecg.avg])
                }
                heartbeat!.innerHTML = ecg.avg.toString()
            } else if(data.event == "spectrum-changes") {
                const res: SpectrumWSEvent = data.data;
                addDataToChart(spectrum, res.spectrum, res.frequency)
            } else if(data.event == "pong" && connectionRate) {
                const latency = Date.now() - startTime;
                connectionRate.innerHTML = latency.toString()
                generateConfig(data.data)
            }
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
            data: startTime.toString(),
        }));
    }

    return socket;
}

