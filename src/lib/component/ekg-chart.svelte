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
	  const chart = new LineChart(`#${name}`, data, config);

	  const unsubscribe = ekgState.subscribe((state) => {
		if (!state || !Array.isArray(state)) {
		  console.warn('Invalid state received:', state);
		  return;
		}

		// Trim the series to keep the last CHUNK_SIZE * 10 elements
		if (data.series[0].length >= CHUNK_SIZE * 10) {
		  data.series[0] = data.series[0].slice(-CHUNK_SIZE * 10);
		}

		// Prevent excessive data growth
		if (data.series[0].length > CHUNK_SIZE * 11.5) {
		  console.warn('Data series length exceeded limit:', data.series[0].length);
		  return; // Skip update to avoid performance issues
		}

		// Add new data and update chart
		data.series[0].push(...state);
		chart.update(data);
	  });

	  // Cleanup subscription on component destroy
	  return () => unsubscribe();
	})
</script>

<div class="w-full h-[600px]">
	<h2 class="h-[10%] text-2xl font-bold">{name.slice(0,1).toUpperCase()+name.slice(1).replaceAll("-", " ")}</h2>
	<div id={name} class="border-[0.5px] border-neutral-700 w-auto h-[80%]"></div>
</div>
