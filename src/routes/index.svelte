<script lang="ts">
	import Map from '$lib/Map/Map.svelte';
	import Marker from '$lib/Marker/Marker.svelte';
	import { LngLat } from 'mapbox-gl';

	let defaultCoords = new LngLat(34.7818, 32.0853);
</script>

<div>
	<Map accessToken="PROVIDE YOUR MAPBOX API KEY HERE" options={{ center: defaultCoords, zoom: 10 }}>
		<Marker coordinates={defaultCoords} />
	</Map>
</div>

<style>
	:global(body) {
		height: 100vh;
		width: 100vw;
	}

	div {
		height: 700px;
		width: 90%;
	}
</style>
