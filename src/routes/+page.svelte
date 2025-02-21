<svelte:options runes="{true}" />
<script lang="ts">
	import EkgChart from "$lib/component/ekg-chart.svelte"
	import HeartrateChart from "$lib/component/heartrate-chart.svelte"
	import Setting from "$lib/component/setting.svelte"
</script>

<aside class="flex flex-col h-screen w-1/5 bg-neutral-800 text-white">
	<div class="p-4">
		<h1 class="font-bold text-4xl w-full text-center">Fitness Tracking Weste</h1>
		<h2 class="text-xl w-full text-center">SIA Project 2024/2025</h2>
	</div>
	<Setting/>
</aside>
<main class="h-screen w-4/5">
	<div class="grid grid-cols-2 h-screen gap-4 p-4">
		<EkgChart name="ekg-graph"/>
		<HeartrateChart name="hearzfrequenze"/>
		<EkgChart name="geolocation"/>
		<EkgChart name="idk"/>
	</div>
</main>
