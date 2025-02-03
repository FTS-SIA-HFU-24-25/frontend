<script lang="ts">
	import '../app.css';
	import { connect } from "$lib/websocket/index"
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
{@render children()}
</div>
