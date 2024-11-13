export interface EcgWSEvent {
	signals: number[];
	avg: number;
	frequency: number;
}

export interface SpectrumWSEvent {
	spectrum: number[];
	frequency: number[];
}
