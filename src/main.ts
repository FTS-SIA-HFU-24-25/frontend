import './global.css'
import { createChart } from "./lib/chart.ts"
import { createWebSocket } from "./lib/websocket.ts"

const chart = createChart("chart", [])

createWebSocket(chart)

