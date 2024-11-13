import Chart from "chart.js/auto"

const FREQUENCY = 100;

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

	chart.options.animation = false; // disables all animations

	return chart
}

export function addDataToChart(chart: Chart<"line", any, unknown>, data: number[], labels?: number[], short?: boolean) {
	if(labels) {
		chart.data.labels = labels;
		chart.data.datasets[0].data = data;
	} else {
		let multiplier = short ? 5 : 20;
		chart.data.labels?.push(new Date().toLocaleTimeString())
		chart.data.datasets[0].data.push(...data)
		if(chart.data.datasets[0].data.length > FREQUENCY * multiplier) {
			console.log("slice", chart.data.datasets[0].data.length, FREQUENCY * multiplier)
			chart.data.datasets[0].data.shift();
			chart.data.labels?.shift();
		}
	}
	console.log(chart.data.datasets[0].data.length)
	chart.update()
}
