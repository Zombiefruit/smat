<script lang="ts">
	import { Marker, LngLat } from 'mapbox-gl';
	import { onDestroy, getContext, setContext } from 'svelte';
	import { mapKey, markerKey } from '../../context';
	import type { MapContext } from '../Map/Map.svelte';

	export let coordinates: LngLat;

	setContext(markerKey, {
		getMarker: () => marker
	});

	const mapContext = getContext<MapContext>(mapKey);
	const map = mapContext.getMap();

	const marker = new Marker().setLngLat(coordinates);

	if (map) marker.addTo(map);

	$: marker.setLngLat(coordinates);

	onDestroy(() => {
		marker.remove();
	});
</script>

<slot />
