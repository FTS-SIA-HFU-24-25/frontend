<script lang="ts">
	import '../app.css';
	import { connect } from "$lib/websocket/index";
	import Setting from "$lib/component/setting.svelte";
	import { page } from '$app/state';

	let { children } = $props();
	
	let webSocketEstablished = $state(false);
	let ws: WebSocket;

	$effect(() => {
		if (webSocketEstablished) {
			return;
		}
		ws = connect();
		webSocketEstablished = true;
	});
</script>

<div class="flex w-full min-h-screen">
  <aside class="flex flex-col w-1/5 bg-neutral-800 text-white sticky top-0 h-screen">
    <div class="p-4">
      <h1 class="font-bold text-4xl w-full text-center">Fitness Tracking Weste</h1>
      <h2 class="text-xl w-full text-center">SIA Project 2024/2025</h2>
    </div>
    <Setting />
    {#if page.url.pathname === '/motion'}
      <a href="/" class="p-4 text-xl font-bold mt-auto bg-neutral-700">Zurück -></a>
    {:else}
      <a href="/motion" class="p-4 text-xl font-bold mt-auto bg-neutral-700">Körperbewegung Tracking -></a>
    {/if}
  </aside>
  <main class="flex-1">
	{@render children()}
  </main>
</div>
