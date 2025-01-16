interface Base<T> {
	event: T;
	data: EKGEvent | SpectrumEvent | Config;
}

export interface Heartrate extends Base<"heartrate"> {
	event: "heartrate";
	data: EKGEvent;
}

export interface Spectrum extends Base<"spectrum"> {
	event: "spectrum";
	data: SpectrumEvent;
}

export interface Pong extends Base<"pong"> {
	event: "pong";
	data: Config;
}

interface Any extends Base<any> {
	event: any;
	data: any;
}

export type WebSocketEvent<T> = T extends "heartrate" ? Heartrate : T extends "spectrum" ? Spectrum : T extends "pong" ? Pong : Any;

export interface EKGEvent {
	signals: number[];	
	avg: number;
	max: number;
	min: number;
	frequency: number;
}

export interface SpectrumEvent {
	spectrum: number;
	frequency: number;
}

export interface Config {
	chunks_size: number;
	start_receive_data: number;
	filter_type: number;
	max_pass: number;
	min_pass: number;
	spectrum_update_request: number;
}
