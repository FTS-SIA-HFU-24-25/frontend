<svelte:options runes="{true}" />
<script lang="ts">
	import EkgChart from "$lib/component/ekg-chart.svelte"
	import HeartrateChart from "$lib/component/heartrate-chart.svelte"
	import TempChart from "$lib/component/temp-chart.svelte"

	//import Map from "$lib/component/map.svelte"
</script>

<main class="w-4/5">
	<div class="grid grid-cols-2 h-screen gap-4 p-4">
		<EkgChart name="ekg-graph"/>
		<HeartrateChart name="herzfrequenz"/>
		<TempChart name="temperatur"/>
		<EkgChart name="geolocation"/>
	</div>
</main>
