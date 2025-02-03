import type { Writable } from "svelte/store"
import { PUBLIC_WEBSOCKET_URI } from "$env/static/public";
import type { WebSocketEvent, EKGEvent, Config } from "$lib/types/websocket"
import { writable } from "svelte/store"

export interface WsState {
	heartrate: EKGEvent;
	lastUpdated: Date;
	ws: WebSocket | null;
	config: Config;
	connected: boolean;
}

export const wsState: Writable<WsState> = writable({
	heartrate: {} as EKGEvent,
	ekg: [],
	lastUpdated: new Date(),
	ws: null,
	config: {} as Config,
	connected: false,
})

export const connect = (): WebSocket => {
	const ws = new WebSocket(PUBLIC_WEBSOCKET_URI+"/ws");

	ws.addEventListener("open", () => {
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
			case "pong":
				_updatePong(wsState, raw as WebSocketEvent<"pong">)	
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
			data: Date.now().toString()
		}))
	}, 3000)
}	

function _updateHeartrate(state: Writable<WsState>, data: WebSocketEvent<"heartrate">) {
	state.update((state) => ({
		...state,
		heartrate: data.data 
	}))
}

function _updatePong(state: Writable<WsState>, data: WebSocketEvent<"pong">) {
	state.update((state) => ({
		...state,
		lastUpdated: new Date(),
		config: data.data
	}))
}
