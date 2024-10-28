import Chart from "chart.js/auto"

export interface ChartData {
	timestamp: string,
	data: any,
	type: number, // 0: ecg, 1: temp, 2: gps
}

export function createChart(id: string, data: ChartData[]): Chart<"line", any, unknown> {
	const chart = new Chart(document.getElementById(id) as HTMLCanvasElement, {
		type: "line",
		data: {
			labels: data.map((d: ChartData) => d.timestamp),
			datasets: [
				{
					label: "",
					data: data.map((d: ChartData) => d.data),
				}
			]
		}
	})

	return chart
}

export function addDataToChart(chart: Chart<"line", any, unknown>, data: ChartData) {
	chart.data.labels?.push(data.timestamp)
	chart.data.datasets[0].data.push(data.data)
	if(chart.data.datasets[0].data.length % 23 === 0) {
		chart.data.labels = chart.data.labels?.slice(1, -1)
		chart.data.datasets[0].data = chart.data.datasets[0].data.slice(1, -1)
	}
	chart.update()
}
