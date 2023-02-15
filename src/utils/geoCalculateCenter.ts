type TGeoCoords = [number, number][];

// function to calculate the center of a map polygon
export const getCenter = (coordinates: TGeoCoords): [number, number] => {
  const center = coordinates.reduce(
    (acc, coord) => {
      acc[0] += coord[0];
      acc[1] += coord[1];
      return acc;
    },
    [0, 0]
  );
  return [center[0] / coordinates.length, center[1] / coordinates.length];
};
