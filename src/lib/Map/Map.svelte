<script context="module" lang="ts">
	export interface MapContext {
		getMap: () => Map | null;
		getLoaded: () => Writable<boolean>;
	}
</script>

<script lang="ts">
	import mapboxgl, { Map, MapboxOptions, MapMouseEvent } from 'mapbox-gl';
	import { onMount, createEventDispatcher, setContext } from 'svelte';
	import { Writable, writable } from 'svelte/store';
	import { mapKey } from '../context';
	import { getMapEventHandlers } from './get-map-event-handlers';

	export let accessToken: string;
	export let options: Omit<MapboxOptions, 'container'> = {};
	export let baseApiUrl = undefined;
	export let container: HTMLElement | string | undefined = undefined;
	export let boxSelect: any = undefined;

	// Props intended for binding
	export let map: Map | null = null;
	export let styleLoaded = false;
	export let loaded: boolean = false;

	mapboxgl.accessToken = accessToken;

	if (baseApiUrl) {
		mapboxgl.baseApiUrl = baseApiUrl;
	}

	const loadedStore = writable(false);

	setContext<MapContext>(mapKey, {
		getMap: () => map,
		getLoaded: () => loadedStore
	});

	const dispatch = createEventDispatcher();

	onMount(() => {
		if (boxSelect) {
			if (options.boxZoom) {
				console.warn('Cannot enable both boxZoom and boxSelect. Disabling boxZoom');
			}
			options.boxZoom = false;
		}

		if (container) {
			map = new Map({ container, style: 'mapbox://styles/mapbox/streets-v11', ...options });
		}

		function handleData(event: Event) {
			if (map) {
				styleLoaded = map.isStyleLoaded();
			}

			dispatch('data', event);
		}

		function handleLoad(event: Event) {
			loaded = true;
			$loadedStore = true;
			dispatch('load', event);
		}

		const eventHandlers = getMapEventHandlers(dispatch);

		for (const [event, { handler }] of Object.entries(eventHandlers)) {
			map?.on(event, handler);
		}

		map?.on('load', handleLoad);
		map?.on('data', handleData);

		return () => {
			for (const [event, { handler }] of Object.entries(eventHandlers)) {
				map?.off(event, handler);
			}

			map?.off('load', handleLoad);
			map?.off('data', handleData);

			map?.remove();
		};
	});
</script>

<svelte:head
	><link
		href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css"
		rel="stylesheet"
	/></svelte:head
>

<div bind:this={container}>
	{#if map}
		<slot />
	{/if}
</div>

<style>
	div {
		width: 100%;
		height: 100%;
	}
</style>
