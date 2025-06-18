interface Base<T> {
	event: T;
	data: EKGEvent | SpectrumEvent | Config | { value: number } | Vector;
}

export interface Heartrate extends Base<"heartrate"> {
	event: "heartrate";
	data: EKGEvent;
}

export interface Temp extends Base<"temp"> {
	event: "temp";
	data: {
		value: number;
	};
}

export interface Spectrum extends Base<"spectrum"> {
	event: "spectrum";
	data: SpectrumEvent;
}

export interface Pong extends Base<"pong"> {
	event: "pong";
	data: Config;
}

export interface Gyro extends Base<"gyro"> {
	event: "gyro";
	data: Vector;
}

export interface Accel extends Base<"accel"> {
	event: "accel";
	data: Vector;
}

interface Any extends Base<any> {
	event: any;
	data: any;
}

export type WebSocketEvent<T> = T extends "heartrate" ? Heartrate : T extends "spectrum" ? Spectrum : T extends "temp" ? Temp : T extends "gyro" ? Gyro : T extends "accel" ? Accel : T extends "pong" ? Pong : Any;

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
	priotize: number;
}

export interface Vector {
	x: number;
	y: number;
	z: number
}
