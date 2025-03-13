<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';

	// Define historical data (e.g., ship positions)
	const historicalData = [
		{ lng: -74.5, lat: 40.0, time: '2025-01-01T00:00:00Z' },
		{ lng: -74.0, lat: 40.5, time: '2025-01-01T01:00:00Z' },
		{ lng: -73.5, lat: 41.0, time: '2025-01-01T02:00:00Z' },
		{ lng: -73.0, lat: 41.5, time: '2025-01-01T03:00:00Z' }
	];

	// GeoJSON for points
	const pointGeojson: any = {
		type: 'FeatureCollection',
		features: historicalData.map((point, index) => ({
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [point.lng, point.lat]
			},
			properties: {
				time: point.time,
				index
			}
		}))
	};

	// GeoJSON for vectors (straight lines between points)
	const vectorGeojson: any = {
		type: 'FeatureCollection',
		features: []
	};
	for (let i = 0; i < historicalData.length - 1; i++) {
		vectorGeojson.features.push({
			type: 'Feature',
			geometry: {
				type: 'LineString',
				coordinates: [
					[historicalData[i].lng, historicalData[i].lat],
					[historicalData[i + 1].lng, historicalData[i + 1].lat]
				]
			},
			properties: {
				segment: i
			}
		});
	}

	onMount(() => {
		// Initialize the map
		const map = new maplibregl.Map({
			container: 'map',
			style: 'https://tiles.openfreemap.org/styles/positron',
			center: [-74.5, 40],
			zoom: 6, 
		});

		const nav = new maplibregl.NavigationControl();
		map.addControl(nav)

		// When the map loads, add sources and layers
		map.on('load', () => {
			// Add point source
			map.addSource('points', {
				type: 'geojson',
				data: pointGeojson
			});

			// Add vector source
			map.addSource('vectors', {
				type: 'geojson',
				data: vectorGeojson
			});

			// Add point layer (circles)
			map.addLayer({
				id: 'points-layer',
				type: 'circle',
				source: 'points',
				paint: {
					'circle-radius': 8,
					'circle-color': '#007cbf',
					'circle-opacity': 0 // Initially hidden
				}
			});

			// Add vector layer (lines)
			map.addLayer({
				id: 'vectors-layer',
				type: 'line',
				source: 'vectors',
				paint: {
					'line-color': '#ff4444',
					'line-width': 2,
					'line-opacity': 0 // Initially hidden
				}
			});

			// Animation logic
			let currentIndex = 0;
			const totalSteps = historicalData.length;

			function animate() {
				if (currentIndex < totalSteps) {
					// Update point visibility
					map.setFilter('points-layer', ['<=', 'index', currentIndex]);
					map.setPaintProperty('points-layer', 'circle-opacity', 1);

					// Update vector visibility
					map.setFilter('vectors-layer', ['<=', 'segment', currentIndex - 1]);
					map.setPaintProperty('vectors-layer', 'line-opacity', 1);

					// Move map camera to follow the current point
					map.easeTo({
						center: [historicalData[currentIndex].lng, historicalData[currentIndex].lat],
						duration: 1000
					});

					currentIndex++;
					setTimeout(animate, 1500); // Move to next point after 1.5 seconds
				}
			}

			// Start animation
			animate();
		});

		// Cleanup on component unmount
		return () => {
			map.remove();
		};
	});
</script>

<div id="map" class="h-[400px] w-[600px]"></div>
