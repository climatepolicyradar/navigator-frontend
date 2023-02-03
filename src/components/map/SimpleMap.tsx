import { ComposableMap, ZoomableGroup, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export default function MapChart() {
  return (
    <ComposableMap>
      <ZoomableGroup zoom="1">
        <Geographies geography={geoUrl}>
          {({ geographies }) => geographies.map((geo: any) => <Geography key={geo.rsmKey} geography={geo} />)}
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}
