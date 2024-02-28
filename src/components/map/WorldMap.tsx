import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, Graticule, Marker, Sphere, ZoomableGroup } from "react-simple-maps";
import { GEO_CENTER_POINTS } from "@constants/mapCentres";

const geoUrl = "/data/map/world-countries-50m.json";

const geoStyle = (isActive: boolean) => {
  return {
    default: {
      fill: isActive ? "#E42" : "#EEE",
      stroke: "#a6a6a6",
      strokeWidth: 0.25,
      outline: "none",
    },
    hover: {
      fill: isActive ? "#E42" : "#a6a6a6",
      cursor: "pointer",
      outline: "none",
    },
  };
};

export default function MapChart() {
  const [activeGeography, setActiveGeography] = useState("");

  const handleGeoClick = (geo) => {
    console.log("handleGeoClick", geo);
    setActiveGeography(geo?.properties?.name ?? "");
  };

  return (
    <div className="map-container my-8">
      <ComposableMap>
        <ZoomableGroup>
          <Sphere id="1" stroke="#E4E5E6" strokeWidth={0.2} fill="none" />
          <Graticule stroke="#E4E5E6" strokeWidth={0.2} />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={geoStyle(activeGeography === geo.properties.name)}
                  onClick={() => handleGeoClick(geo)}
                />
              ))
            }
          </Geographies>
          {Object.keys(GEO_CENTER_POINTS).map((point) => (
            <Marker key={point} coordinates={GEO_CENTER_POINTS[point]} onClick={() => handleGeoClick(point)}>
              <circle r={2} fill="black" cursor="pointer" />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
