<script lang="ts">
	import { wsState } from "$lib/websocket/index";

	wsState.subscribe((state) => {
		console.log("State: ", state);
	});
</script>
