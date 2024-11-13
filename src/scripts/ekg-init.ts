import { createChart, ChartData } from "./lib/chart.ts"
import { createWebSocket } from "./lib/websocket.ts"
import Chart from "chart.js/auto"

const data: any[] = [];
const chart = new Chart(document.getElementById("chart") as HTMLCanvasElement, {
	type: "line",
	data: {
		labels: data.map((d: ChartData) => d.timestamp),
		datasets: [
			{
				label: "Herzfrequenz",
				data: data.map((d: ChartData) => d.data),
				pointRadius: 0,
				borderColor: "#be123c"
			}
		]
	},
	options: {
		plugins: {
			legend: {
				display: false,
			},
			title: {
				display: false,
			}
		},
		scales: {
			x: {
				ticks: {
					callback: function(value, index, _ticks) {
						if (index === 0) {
							return this.getLabelForValue(value as number); // Only show labels at start, middle, and end
						}
						return '';
					}
				},
				grid: {
					color: "#999",
				}
			},
			y: {
				max: 1.05,
				min: -1.05,
				grid: {
					color: "#999"
				},
				ticks: {
					callback: function() {
						return ''
					} 
				}
			},
		},
	},
})

const hb = new Chart(document.getElementById("hb") as HTMLCanvasElement, {
	type: "line",
	data: {
		labels: data.map((d: ChartData) => d.timestamp),
		datasets: [
			{
				data: data.map((d: ChartData) => d.data),
				pointRadius: 0,
				borderColor: "#be123c"
			}
		]
	},
	options: {
		plugins: {
			legend: {
				display: false,
			},
			title: {
				display: false,
			}
		},
		scales: {
			x: {
				ticks: {
					callback: function() {
						return ""
					}
				},
			},
		},
	},
})

const spectrum = new Chart(document.getElementById("spectrum") as HTMLCanvasElement, {
	type: "line",
	data: {
		labels: data.map((d: ChartData) => d.timestamp),
		datasets: [
			{
				data: data.map((d: ChartData) => d.data),
				pointRadius: 0,
				borderColor: "#be123c"
			}
		]
	},
	options: {
		plugins: {
			legend: {
				display: false,
			},
			title: {
				display: false,
			}
		},
		scales: {
			x: {
				grid: {
					color: "#999",
				}
			},
			y: {
				grid: {
					color: "#999"
				},
			},
		},
	},
})

chart.options.animation = false; // disables all animations
hb.options.animation = false;
spectrum.options.animation = false;

createWebSocket(chart,hb,spectrum)
