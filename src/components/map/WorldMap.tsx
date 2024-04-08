import React, { useRef, useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, Graticule, Marker, Sphere, ZoomableGroup, Point as TPoint } from "react-simple-maps";
import useConfig from "@hooks/useConfig";
import useGeographies from "@hooks/useGeographies";
import { GEO_CENTER_POINTS } from "@constants/mapCentres";
import { GEO_EU_COUNTRIES } from "@constants/mapEUCountries";
import { TGeography } from "@types";
import { Tooltip, TooltipRefProps } from "react-tooltip";
import { LinkWithQuery } from "@components/LinkWithQuery";
import GeographySelect from "./GeographySelect";
import { ZoomControls } from "./ZoomControls";

const geoUrl = "/data/map/world-countries-50m.json";

type TGeo = {
  geometry: { type: string; coordinates: TPoint[] };
  id: string;
  properties: { name: string };
  rsmKey: string;
  svgPath: string;
  type: string;
};

type TGeographyWithCoords = TGeography & { coords: TPoint };

type TGeographiesWithCoords = { [key: string]: TGeographyWithCoords };

const geoStyle = (isActive: boolean) => {
  return {
    default: {
      fill: isActive ? "#1F93FF" : "#dfdfdf",
      stroke: "#fff",
      strokeWidth: 0.25,
      outline: "none",
    },
    hover: {
      fill: "#1F93FF",
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

const maxZoom = 20;
const minZoom = 1;

const GeographyDetail = ({ geo, geographies }: { geo: any; geographies: TGeographiesWithCoords }) => {
  const geography = Object.values(geographies).find((country) => country.display_value === geo);
  if (!geography) {
    return (
      <>
        <p>We do not have any information for this area yet. ({geo})</p>
      </>
    );
  }
  return (
    <>
      {geography && (
        <>
          <p className="font-bold">{geography.display_value}</p>
          <p>Laws and policies: TBC</p>
          <p>
            <LinkWithQuery href={`/geographies/${geography.slug}`}>View territory profile</LinkWithQuery>
          </p>
        </>
      )}
    </>
  );
};

// TODO:
// - Add document type selector
// - Add button to toggle between EU unified view

export default function MapChart() {
  const configQuery = useConfig();
  const geographiesQuery = useGeographies();
  const { data: { countries: configContries = [] } = {} } = configQuery;
  const { data: mapData = [], status: mapDataStatus } = geographiesQuery;
  console.log(mapDataStatus, mapData);
  const geographyInfoTooltipRef = useRef<TooltipRefProps>(null);
  const mapRef = useRef(null);
  const [activeGeography, setActiveGeography] = useState("");
  const [mapCenter, setMapCenter] = useState<TPoint>([0, 0]);
  const [mapZoom, setMapZoom] = useState(1);
  const [showUnifiedEU, setShowUnifiedEU] = useState(false);

  const geographiesWithCoords: TGeographiesWithCoords = useMemo(
    () =>
      configContries.reduce((acc, country) => {
        acc[country.value] = { ...country, coords: GEO_CENTER_POINTS[country.value] };
        return acc;
      }, {}),
    [configContries]
  );

  const handleGeoClick = (e: React.MouseEvent<SVGPathElement>, geo: TGeo) => {
    setActiveGeography(geo.properties.name);
    const geography = Object.values(geographiesWithCoords).find((g) => g.display_value === geo.properties.name);
    openToolTip([e.clientX, e.clientY], geography?.display_value ?? "");
  };

  const handleMarkerClick = (e: React.MouseEvent<SVGPathElement>, countryCode: string) => {
    const geography = geographiesWithCoords[countryCode];
    openToolTip([e.clientX, e.clientY], geography?.display_value ?? "");
  };

  const handleGeoHover = (e: React.MouseEvent<SVGPathElement>, hoveredGeo: string) => {
    setActiveGeography("");
    openToolTip([e.clientX, e.clientY], hoveredGeo);
  };

  // const handleGeoLeave = (e: React.MouseEvent<SVGPathElement>) => {
  //   // check if the mouse is over the tooltip
  //   if (e.relatedTarget && (e.relatedTarget as HTMLElement).classList.contains("react-tooltip")) return;
  //   console.log(e);
  //   setActiveGeography("");
  //   geographyInfoTooltipRef.current?.close();
  // };

  const handleGeographySelected = (selectedCountry: TGeographyWithCoords) => {
    setActiveGeography(selectedCountry.display_value);
    setMapCenter(selectedCountry.coords);
    setMapZoom(5);
    const mapElement = mapRef.current;
    if (mapElement) {
      const mapRect = mapElement.getBoundingClientRect();
      const x = mapRect.left + mapRect.width / 2;
      const y = mapRect.top + mapRect.height / 2;
      openToolTip([x, y], selectedCountry.display_value);
    }
  };

  const handleResetMapClick = () => {
    setMapCenter([0, 0]);
    setMapZoom(1);
    setActiveGeography("");
    geographyInfoTooltipRef.current?.close();
  };

  const openToolTip = (coords: [number, number], selectedGeography: string) => {
    setActiveGeography(selectedGeography);
    geographyInfoTooltipRef.current?.open({
      position: {
        x: coords[0],
        y: coords[1],
      },
      place: "bottom",
      content: <GeographyDetail geo={selectedGeography} geographies={geographiesWithCoords} />,
    });
  };

  return (
    <>
      <div className="flex justify-between items-center my-4">
        <div></div>
        <div>
          <div className="flex items-center gap-4">
            <div className="relative w-[300px]" data-cy="geographies">
              <GeographySelect
                title="Search for a country or territory"
                list={geographiesWithCoords}
                keyField="value"
                keyFieldDisplay="display_value"
                filterType="geography"
                selectedList={[]}
                handleFilterChange={(_, value) => {
                  handleGeographySelected(geographiesWithCoords[value]);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div ref={mapRef} className="map-container relative border" data-cy="world-map">
        <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 160 }} height={340}>
          <ZoomableGroup
            maxZoom={maxZoom}
            minZoom={minZoom}
            center={mapCenter}
            zoom={mapZoom}
            translateExtent={[
              [-400, -200],
              [1000, 600],
            ]}
            onMoveStart={() => {
              geographyInfoTooltipRef.current?.close();
              setActiveGeography("");
            }}
            onMoveEnd={(e) => {
              setMapZoom(e.zoom);
              setMapCenter(e.coordinates);
            }}
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleGeoClick(e, geo);
                    }}
                    onMouseOver={(e) => {
                      handleGeoHover(e, geo.properties.name);
                    }}
                    // onMouseLeave={(e) => {
                    //   handleGeoLeave(e);
                    // }}
                  />
                ))
              }
            </Geographies>
            {Object.keys(geographiesWithCoords).map((i) => {
              const geo = geographiesWithCoords[i];
              if (!geo.coords) return null;
              if (!showUnifiedEU && geo.value === "EU") return null;
              if (showUnifiedEU && GEO_EU_COUNTRIES.includes(geo.value)) return null;
              return (
                <Marker
                  key={geo.slug}
                  coordinates={geo.coords}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleMarkerClick(e, geo.value);
                  }}
                  onMouseOver={(e) => {
                    handleGeoHover(e, geo.display_value);
                  }}
                  style={markerStyle}
                >
                  <circle r={2} />
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
        <Tooltip id="mapToolTip" ref={geographyInfoTooltipRef} afterHide={() => setActiveGeography("")} imperativeModeOnly clickable />
        <ZoomControls
          mapZoom={mapZoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          handleZoomIn={() => setMapZoom(mapZoom + 1)}
          handleZoomOut={() => setMapZoom(mapZoom - 1)}
          handleReset={handleResetMapClick}
        />
        <div className="absolute top-0 right-0 p-4">
          <label
            className="checkbox-input flex items-center py-2 px-1 rounded-md cursor-pointer border border-gray-300 bg-white"
            htmlFor="show_eu_aggregated"
          >
            <input
              className="border-gray-300 cursor-pointer"
              id="show_eu_aggregated"
              type="checkbox"
              name="exact_match"
              value={0}
              checked={showUnifiedEU}
              onChange={() => setShowUnifiedEU(!showUnifiedEU)}
            />
            <span className="px-2 text-sm">Show EU aggregated data</span>
          </label>
        </div>
      </div>
    </>
  );
}
