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

setInterval(() => {
	const newData: ChartData = {
		timestamp: new Date().toLocaleTimeString(),
		data: Math.floor(Math.random() * 100),
		type: 0
	}

	console.log(newData)

	addDataToChart(chart, newData)
}, 1000)
