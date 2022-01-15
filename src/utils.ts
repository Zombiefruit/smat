export function coordinatesAtClick(
	coordinates: [lng: number, lat: number],
	{ lng }: { lng: number }
): [lng: number, lat: number] {
	// Ensure that if the map is zoomed out such that
	// multiple copies of the feature are visible, the
	// popup appears over the copy being pointed to.
	let newLng = coordinates[0];
	while (Math.abs(lng - newLng) > 180) {
		newLng += lng > newLng ? 360 : -360;
	}
	return [newLng, coordinates[1]];
}

export function omitUndefinedValues<T extends Record<string, unknown>>(object: T): T {
	const result: Record<string, unknown> = {};

	for (const key in object) {
		if (object[key] !== undefined) {
			result[key] = object[key];
		}
	}
	return result as T;
}
