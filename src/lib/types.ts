export interface EcgWSEvent {
	signals: number[];
	avg: number;
	min: number;
	max: number;
	frequency: number;
	timestamp: Date;
}
