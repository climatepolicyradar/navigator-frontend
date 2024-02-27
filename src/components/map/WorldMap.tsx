import React from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { GEO_CENTER_POINTS } from "@constants/mapCentres";

const geoUrl = "/data/map/world-countries.json";

const geoStyle = {
  default: {
    fill: "#EEE",
    stroke: "#a6a6a6",
    strokeWidth: 0.25,
  },
  hover: {
    fill: "#a6a6a6",
    cursor: "pointer",
  },
  pressed: {
    fill: "#E42",
    cursor: "pointer",
  },
};

export default function MapChart() {
  const handleGeoClick = (geo) => {
    console.log(geo);
  };

  return (
    <ComposableMap>
      <ZoomableGroup>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} style={geoStyle} onClick={() => handleGeoClick(geo)} />)
          }
        </Geographies>
        {Object.keys(GEO_CENTER_POINTS).map((point) => (
          <Marker key={point} coordinates={GEO_CENTER_POINTS[point]} onClick={() => handleGeoClick(point)}>
            <circle r={2} fill="#F53" cursor="pointer" />
          </Marker>
        ))}
      </ZoomableGroup>
    </ComposableMap>
  );
}
