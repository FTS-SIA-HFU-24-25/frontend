<script lang="ts">
	import '../app.css';
	import { connect } from "$lib/websocket/index"
	import Setting from "$lib/component/setting.svelte"

	let { children } = $props();
	
	let webSocketEstablished = $state(false);

	$effect(() => {
		if (webSocketEstablished) {
			return
		}
		connect()
		webSocketEstablished = true;
	})
</script>

<div class="flex w-full h-auto">
<aside class="flex flex-col h-screen w-1/5 bg-neutral-800 text-white">
	<div class="p-4">
		<h1 class="font-bold text-4xl w-full text-center">Fitness Tracking Weste</h1>
		<h2 class="text-xl w-full text-center">SIA Project 2024/2025</h2>
	</div>
	<Setting/>
</aside>
{@render children()}
</div>
