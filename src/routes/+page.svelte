<script lang="ts">
	import { wsState } from "$lib/websocket/index";
	import type { WsState } from "$lib/websocket/index";

	let isWSReady = $state(false);
	let currWsState = $state<WsState | null>(null);

	wsState.subscribe((state) => {
		console.log("State: ", state);
		isWSReady = state.connected;
		currWsState = state;
	});
</script>

<aside class="flex flex-col h-screen w-1/5 bg-neutral-800 text-white">
	<div class="p-4">
		<h1 class="font-bold text-4xl w-full text-center">Fitness Tracking Weste</h1>
		<h2 class="text-xl w-full text-center">SIA Project 2024/2025</h2>
	</div>
	<div class="px-2 mt-4">
		{#if isWSReady && currWsState}
			<p class="">Server <span class="ml-4 font-bold bg-green-700 rounded-xl px-2">connected</span></p>
			<p class="">Update <span class="ml-4 font-bold ">{currWsState.lastUpdated.toLocaleTimeString()}</span></p>
		{/if}
		{#if !isWSReady}
			<p class="">Server: <span class="font-bold bg-red-700 rounded-xl px-2">disconnected</span></p>
		{/if}
	</div>
</aside>
<main class="h-screen w-4/5">

</main>
