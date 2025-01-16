interface Base<T> {
	event: T;
	data: EKGEvent | SpectrumEvent;
}

export interface Heartrate extends Base<"heartrate"> {
	event: "heartrate";
	data: EKGEvent;
}

export interface Spectrum extends Base<"spectrum"> {
	event: "spectrum";
	data: SpectrumEvent;
}

interface Any extends Base<any> {
	event: any;
	data: any;
}

export type WebSocketEvent<T> = T extends "heartrate" ? Heartrate : T extends "spectrum" ? Spectrum : Any;

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
