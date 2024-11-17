export interface Config {
	chunks_size: number;
	start_receive_data: number;
	filter_type: number;
	max_pass: number;
	min_pass: number;
	spectrum_update_request: number;
}

export function createListener(socket: WebSocket) {
	console.log("Create Listener");

	// Wrap event listener logic in a function for reuse
	const attachListeners = () => {
		const chunkSize = document.getElementById("chunks_size");
		chunkSize?.addEventListener("input", changeChunkSize);

		const maxPass = document.getElementById("max_pass");
		maxPass?.addEventListener("input", changeMaxPass);

		const minPass = document.getElementById("min_pass");
		minPass?.addEventListener("input", changeMinPass);

		const spectrumReq = document.getElementById("spectrum_req");
		spectrumReq?.addEventListener("click", () => {
			socket.send(JSON.stringify({ event: 5, data: "" }));
			localStorage.setItem("update", "1");
		});

		const update = document.getElementById("update");
		update?.addEventListener("click", () => {
			const config = JSON.parse(localStorage.getItem("config") || "{}");
			socket.send(JSON.stringify({ event: 4, data: JSON.stringify(config) }));
			localStorage.setItem("update", "1");
		});

		const start = document.getElementById("start");
		start?.addEventListener("click", () => {
			const config = JSON.parse(localStorage.getItem("config") || "{}");
			config.start_receive_data = config.start_receive_data === 0 ? 1 : 0;
			localStorage.setItem("config", JSON.stringify(config));
			socket.send(JSON.stringify({ event: config.start_receive_data === 0 ? 2 : 3, data: "" }));
		});
	};

	// Attach listeners initially
	attachListeners();

	// Optionally, reattach listeners when config is regenerated
	const configObserver = new MutationObserver(() => attachListeners());
	const configElem = document.getElementById("config");
	if (configElem) {
		configObserver.observe(configElem, { childList: true });
	}
}

export function generateConfig(config: Config) {
	let localConfStr = localStorage.getItem("config");
	let update = localStorage.getItem("update");
	let localConf: Config = JSON.parse(localConfStr || "{}");
	console.log(localConfStr, config);

	if (update == "1") {
		localStorage.setItem("config", JSON.stringify(config));
		localConf = config;
		localStorage.setItem("update", "0");
	}

	const configElem = document.getElementById("config");
	configElem!.innerHTML = `
		<h2>Konfiguration</h2>
		<div class="w-full flex justify-between">
			<label>Chunk-Größe</label>
			<input class="w-1/3" type="number" step="0.5" value="${localConf.chunks_size}" id="chunks_size">
		</div>
		<h2 class="mt-1">Filter</h2>
		<div class="w-full flex justify-between">
			<label>Maximale Pässe</label>
			<input class="w-1/3" type="number" value="${localConf.max_pass}" id="max_pass">
		</div>
		<div class="w-full flex justify-between">
			<label>Minimale Pässe</label>
			<input class="w-1/3" type="number" value="${localConf.min_pass}" id="min_pass">
		</div>
		<div class="w-full flex justify-between mt-1">
			<button id="spectrum_req" class="w-1/2">Spectrum</button>
			<button id="start" class="w-1/2">${!localConf.start_receive_data ? 'Starten' : 'Stopen'}</button>
		</div>
		<button id="update" class="w-full">Ändern!</button>
	`;
}
export function changeChunkSize(e: Event) {
	console.log("changeChunkSize")
	const config: Config = JSON.parse(localStorage.getItem("config") || "{}");
	const chunks_size = (e.target as HTMLInputElement).value;
	config.chunks_size = parseInt(chunks_size);
	localStorage.setItem("config", JSON.stringify(config));
}

export function changeMaxPass(e: Event) {
	const config: Config = JSON.parse(localStorage.getItem("config") || "{}");
	const max_pass = (e.target as HTMLInputElement).value;
	config.max_pass = parseInt(max_pass);
	if(config.max_pass > 0) {
		if(config.min_pass == 0) {
			config.filter_type = 1;
		} else {
			config.filter_type = 3;
		}
	} else {
		if(config.min_pass > 0) {
			config.filter_type = 2;
		} else {
			config.filter_type = 0;
		}
	}
	localStorage.setItem("config", JSON.stringify(config));
}

export function changeMinPass(e: Event) {
	const config: Config = JSON.parse(localStorage.getItem("config") || "{}");
	const min_pass = (e.target as HTMLInputElement).value;
	config.min_pass = parseInt(min_pass);
	if(config.max_pass > 0) {
		if(config.min_pass == 0) {
			config.filter_type = 1;
		} else {
			config.filter_type = 3;
		}
	} else {
		if(config.min_pass > 0) {
			config.filter_type = 2;
		} else {
			config.filter_type = 0;
		}
	}
	localStorage.setItem("config", JSON.stringify(config));
}

