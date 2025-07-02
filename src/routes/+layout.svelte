<script lang="ts">
	import '../app.css';
	import { connect } from "$lib/websocket/index";
	import Setting from "$lib/component/setting.svelte";
	import { gyroState, accelState } from "$lib/websocket/index"
	import { getOrientation } from "$lib/utils"

	let { children } = $props();
	let webSocketEstablished = $state(false);
	let ws: WebSocket;

	let gValues = $state(0);
	let accel = $state({ x: 0,y:0,z:0 })
	let orientation = $state("")
	let gyro = $state({ x: 0,y:0,z:0 })

	$effect(() => {
		if (webSocketEstablished) {
			return;
		}
		ws = connect();
		webSocketEstablished = true;
	});

	accelState.subscribe((val) => {
	  console.log(val)
	  gValues = Math.round(Math.sqrt(val.x*val.x + val.y*val.y + val.z*val.z) * 100) / 100
	  accel = val
	})

	gyroState.subscribe((val) => {
	  orientation = getOrientation(val)
	  gyro = val
	})
</script>

<div class="flex w-full min-h-screen">
  <aside class="flex flex-col w-1/5 bg-neutral-800 text-white sticky top-0 h-screen">
    <div class="p-4">
      <h1 class="font-bold text-4xl w-full text-center">Fitness Tracking Weste</h1>
      <h2 class="text-xl w-full text-center">SIA Project 2024/2025</h2>
    </div>
    <Setting />
    <div class="w-[90%] flex justify-center items-center mt-4">
      <div class="h-[1px] w-[90%] bg-white"></div>
    </div>
    <div class="px-4 mt-4">
      <div class="">
	<h1 class="mr-4 font-bold">G-Kraft</h1>
	<span>{gValues}</span>
      </div>
      <div class="mt-4">
	<h1 class="mr-4 font-bold">Orientation</h1>
	<span>{orientation}</span>
      </div>
      <div class="mt-4">
	<h1 class="mr-4 font-bold">Accelerometer</h1>
	<span>{accel.x}, {accel.y}, {accel.y}</span>
      </div>
      <div class="mt-4">
	<h1 class="mr-4 font-bold">Gyroskop</h1>
	<span>{gyro.x}, {gyro.y}, {gyro.y}</span>
      </div>
    </div>
    <div class="w-[90%] flex justify-center items-center mt-4">
      <div class="h-[1px] w-[90%] bg-white"></div>
    </div>
    <div class="px-4 mt-4">
      <div class="">
	<h1 class="mr-4 font-bold">Person</h1>
	<span>Sergkei Simonyan</span>
      </div>
      <div class="mt-4">
	<h1 class="mr-4 font-bold">Alter</h1>
	<span>18 Jahre alt</span>
      </div>
      <div class="mt-4">
	<h1 class="mr-4 font-bold">Geschlecht</h1>
	<span>Divers</span>
      </div>
      <div class="mt-4">
	<h1 class="mr-4 font-bold">Groesse/Gewicht</h1>
	<span>182cm/82kg</span>
      </div>
    </div>
  </aside>
  <main class="flex-1">
	{@render children()}
  </main>
</div>
