import React, { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, Graticule, Marker, Sphere, ZoomableGroup, Point as TPoint } from "react-simple-maps";
import { GEO_CENTER_POINTS } from "@constants/mapCentres";
import useConfig from "@hooks/useConfig";
import { TGeography } from "@types";

const geoUrl = "/data/map/world-countries-50m.json";

type TGeo = {
  geometry: { type: string; coordinates: TPoint[] };
  id: string;
  properties: { name: string };
  rsmKey: string;
  svgPath: string;
  type: string;
};

type TCountry = TGeography & { coords: TPoint };

type TCountries = { [key: string]: TCountry };

const geoStyle = (isActive: boolean) => {
  return {
    default: {
      fill: isActive ? "#1F93FF" : "#dfdfdf",
      stroke: "#fff",
      strokeWidth: 0.25,
      outline: "none",
    },
    hover: {
      fill: isActive ? "#1F93FF" : "#a6a6a6",
      cursor: "pointer",
      outline: "none",
    },
  };
};

const markerStyle = {
  default: {
    fill: "#E4E7EC",
    stroke: "#1D2939",
    strokeWidth: 0.25,
    outline: "none",
    cursor: "pointer",
  },
  hover: {
    fill: "#1F93FF",
    stroke: "#1D2939",
    strokeWidth: 0.25,
    outline: "none",
    cursor: "pointer",
  },
  pressed: {
    fill: "#1F93FF",
    stroke: "#1D2939",
    strokeWidth: 0.25,
    outline: "none",
    cursor: "pointer",
  },
};

// TODO: add a tooltip to the map

export default function MapChart() {
  const configQuery = useConfig();
  const { data: { countries: configContries = [] } = {} } = configQuery;
  const [activeGeography, setActiveGeography] = useState("");
  const [mapCenter, setMapCenter] = useState<TPoint>([0, 0]);
  const [mapZoom, setMapZoom] = useState(1);

  const countries: TCountries = useMemo(
    () =>
      configContries.reduce((acc, country) => {
        acc[country.value] = { ...country, coords: GEO_CENTER_POINTS[country.value] };
        return acc;
      }, {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleGeoClick = (geo: TGeo) => {
    setActiveGeography(geo.properties.name);
    const geography = Object.values(countries).find((country) => country.display_value === geo.properties.name);
    setMapCenter(geography.coords);
    setMapZoom(3);
  };

  const handleMarkerClick = (countryCode: string) => {
    const geography = countries[countryCode];
    setActiveGeography(geography?.display_value ?? "");
    setMapCenter(GEO_CENTER_POINTS[countryCode]);
    setMapZoom(3);
  };

  const handleResetMapClick = () => {
    setMapCenter([0, 0]);
    setMapZoom(1);
    setActiveGeography("");
  };

  return (
    <div className="map-container my-8">
      <button onClick={handleResetMapClick}>Reset map</button>
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 160 }}>
        <ZoomableGroup
          center={mapCenter}
          zoom={mapZoom}
          translateExtent={[
            [-600, -400],
            [1200, 800],
          ]}
        >
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
            <Marker key={point} coordinates={GEO_CENTER_POINTS[point]} onClick={() => handleMarkerClick(point)} style={markerStyle}>
              <circle r={2} />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
