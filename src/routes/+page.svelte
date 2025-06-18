<svelte:options runes="{true}" />
<script lang="ts">
	import EkgChart from "$lib/component/ekg-chart.svelte"
	import HeartrateChart from "$lib/component/heartrate-chart.svelte"
	import TempChart from "$lib/component/temp-chart.svelte"
</script>

<main class="w-full p-10">
	<EkgChart name="ekg-graph"/>
	<div class="grid grid-cols-2 h-[600px] gap-4">
		<HeartrateChart name="herzfrequenz"/>
		<TempChart name="temperatur"/>
	</div>
</main>
