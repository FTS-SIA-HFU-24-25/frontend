import { writable } from "svelte/store"
import { PUBLIC_WEBSOCKET_URI } from "$env/static/public";
import type { WebSocketEvent, EKGEvent } from "$lib/types/websocket"

type State = {
	heartrate: EKGEvent;
	createdAt: Date;
}

export const state = writable<State>({
	heartrate: {} as EKGEvent,
	createdAt: new Date(),
})

export const connect = () => {
	const ws = new WebSocket(PUBLIC_WEBSOCKET_URI);

	ws.addEventListener("message", (message: any) => {
		const raw: WebSocketEvent<any> = JSON.parse(message.data);
		switch(raw.event) {
			case "heartrate":
				_updateHeartrate(raw as WebSocketEvent<"heartrate">)
		}
	})
}

function _updateHeartrate(data: WebSocketEvent<"heartrate">) {
	state.update((state) => ({
		...state,
		heartrate: data.data 
	}))
}
