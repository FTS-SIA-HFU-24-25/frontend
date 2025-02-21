<svelte:options runes="{true}" />
<script lang="ts">
	import "./linechart.css"
	import { PUBLIC_CHUNK_SIZE } from "$env/static/public";
	import { onMount } from "svelte"
	import { LineChart, AutoScaleAxis } from 'chartist';
	import type { LineChartOptions } from "chartist";
	import { ekgState } from "$lib/websocket/index"

	const { name } = $props();

	const CHUNK_SIZE = parseInt(PUBLIC_CHUNK_SIZE)

	const data: {series: number[][]} =  {
		series: [[]]
	}

	const config: LineChartOptions = {
		showArea: true,
		lineSmooth: false, 
		axisY: {
			type: AutoScaleAxis,
			scaleMinSpace: 50, 
		},
		fullWidth: false,
	}
	
	onMount(() => {
		const chart = new LineChart(`#${name}`, data, config)
		ekgState.subscribe((state) => {
			if(!state) return;
			if(data.series[0].length >= CHUNK_SIZE*10) {
				data.series[0] = data.series[0].slice(CHUNK_SIZE+1) // CHANGE CHUNK SIZE HERE
			}
			if(data.series[0].length > CHUNK_SIZE * 11.5) return console.log("Not working!");
			data.series[0].push(...state);
			chart.update(data)
		})	
	})
</script>

<div class="h-full">
	<h2 class="h-[10%] text-2xl font-bold">{name.slice(0,1).toUpperCase()+name.slice(1).replaceAll("-", " ")}</h2>
	<div id={name} class="border-[0.5px] border-neutral-700 w-auto h-[80%]"></div>
</div>
