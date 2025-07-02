import type { Writable } from "svelte/store"
import { PUBLIC_WEBSOCKET_URI } from "$env/static/public";
import type { WebSocketEvent,  Config } from "$lib/types/websocket"
import { writable } from "svelte/store"
import { page } from "$app/state"

export interface WsState {
	lastUpdated: Date;
	ws: WebSocket | null;
	config: Config;
	connected: boolean;
}

export const wsState: Writable<WsState> = writable({
	lastUpdated: new Date(),
	ws: null,
	config: {} as Config,
	connected: false,
})

export const ekgState: Writable<number[]> = writable([])

export const heartrateState: Writable<number> = writable(0)

export const tempState: Writable<number> = writable(0)
export const gyroState: Writable<{x: number, y: number, z: number}> = writable({x: 0, y: 0, z: 90})
export const accelState: Writable<{x: number, y: number, z: number}> = writable({x: 0, y: 0, z: 0})

export const connect = (): WebSocket => {
	const ws = new WebSocket(PUBLIC_WEBSOCKET_URI+"/ws");

	ws.addEventListener("open", () => {
		if (page.url.pathname === '/motion') {
			send(ws, 3, null);
		} else {
			send(ws, 2, null);
		}
		console.log("Connected to websocket")
		ping(ws);
		wsState.update((state) => ({
			...state,
			lastUpdated: new Date(),
			ws: ws,
			connected: true,
		}))
	})

	ws.addEventListener("message", (message: any) => {
		const raw: WebSocketEvent<any> = JSON.parse(message.data);
		switch(raw.event) {
			case "ekg-changes":
				_updateHeartrate(wsState, raw as WebSocketEvent<"heartrate">)
				return;
			case "pong":
				console.log(raw.data.priotize, page.url.pathname === '/motion' && raw.data.priotize == 2)
				if (page.url.pathname === '/motion' && raw.data.priotize == 2) {
					send(ws, 3, {});
				} else if(page.url.pathname == "/" && raw.data.priotize == 3) {
					send(ws, 2, {});
				}
				_updatePong(wsState, raw as WebSocketEvent<"pong">)	
				return;
			case "temp":
				_updateTemp(wsState, raw as WebSocketEvent<"temp">)
				return;
			case "gyro":
				_updateGyro(wsState, raw as WebSocketEvent<"gyro">)	
				return;
			case "accel":
				_updateAccel(wsState, raw as WebSocketEvent<"accel">)	
				return;
			default:
				console.log(message.data)
		}
	})

	ws.addEventListener("close", () => {
		console.log("Disconnected from websocket")
		wsState.update((state) => ({
			...state,
			lastUpdated: new Date(),
			ws: ws,
			connected: false,
		}))
	})

	return ws
}

export const send = (ws: WebSocket, event: number, data: any) => {
	ws.send(JSON.stringify({event, data}))
}

export const ping = (ws: WebSocket) => {
	setInterval(() => {
		ws.send(JSON.stringify({
			event: 1,
			data: page.url.pathname == "/" ? 2 : 3 
		}))
	}, 3000)
}	

function _updateHeartrate(_state: Writable<WsState>, data: WebSocketEvent<"heartrate">) {
	ekgState.update(() => data.data.signals)
	heartrateState.update(() => data.data.avg)
}

function _updatePong(state: Writable<WsState>, data: WebSocketEvent<"pong">) {
	state.update((state) => ({
		...state,
		lastUpdated: new Date(),
		config: data.data
	}))
}

function _updateTemp(_state: Writable<WsState>, data: WebSocketEvent<"temp">) {
	tempState.update(() => data.data.value)
}

function _updateGyro(_state: Writable<WsState>, data: WebSocketEvent<"gyro">) {
	console.log(data.data)
	gyroState.update(() => data.data)
}

function _updateAccel(_state: Writable<WsState>, data: WebSocketEvent<"accel">) {
	accelState.update(() => data.data)
}
