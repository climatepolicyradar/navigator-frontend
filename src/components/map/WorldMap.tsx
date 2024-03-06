import React, { useRef, useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, Graticule, Marker, Sphere, ZoomableGroup, Point as TPoint } from "react-simple-maps";
import useConfig from "@hooks/useConfig";
import { GEO_CENTER_POINTS } from "@constants/mapCentres";
import { GEO_EU_COUNTRIES } from "@constants/mapEUCountries";
import { TGeography } from "@types";
import { Tooltip, TooltipRefProps } from "react-tooltip";
import { LinkWithQuery } from "@components/LinkWithQuery";
import ByTextInput from "@components/filters/ByTextInput";
import MultiList from "@components/filters/MultiList";
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
          <p>Laws and policies: 24</p>
          <p>
            <LinkWithQuery href={`/geographies/${geography.slug}`}>View country profile</LinkWithQuery>
          </p>
        </>
      )}
    </>
  );
};

// TODO:
// - Move tooltip show and hide to reusable component
// - Add document type selector
// - Add button to toggle between EU unified view
// - Add zoom buttons

export default function MapChart() {
  const configQuery = useConfig();
  const { data: { countries: configContries = [] } = {} } = configQuery;
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
    // console.log("handleGeoClick - geography", geography, geo);
    if (geography) {
      // setMapCenter(geography.coords);
      // setMapZoom(5);
      const mapElement = mapRef.current;
      if (mapElement) {
        // const mapRect = mapElement.getBoundingClientRect();
        // const x = mapRect.left + mapRect.width / 2;
        // const y = mapRect.top + mapRect.height / 2;
        const x = e.clientX;
        const y = e.clientY;
        geographyInfoTooltipRef.current?.open({
          position: {
            x,
            y,
          },
          place: "bottom",
          content: <GeographyDetail geo={geography?.display_value} geographies={geographiesWithCoords} />,
        });
      }
    }
  };

  const handleMarkerClick = (e: React.MouseEvent<SVGPathElement>, countryCode: string) => {
    // console.log("countryCode", countryCode);
    const geography = geographiesWithCoords[countryCode];
    setActiveGeography(geography?.display_value ?? "");
    // setMapCenter(GEO_CENTER_POINTS[countryCode]);
    // setMapZoom(5);
    const mapElement = mapRef.current;
    if (mapElement) {
      // const mapRect = mapElement.getBoundingClientRect();
      // const x = mapRect.left + mapRect.width / 2;
      // const y = mapRect.top + mapRect.height / 2;
      const x = e.clientX;
      const y = e.clientY;
      geographyInfoTooltipRef.current?.open({
        position: {
          x,
          y,
        },
        place: "bottom",
        content: <GeographyDetail geo={geography?.display_value} geographies={geographiesWithCoords} />,
      });
    }
  };

  const handleGeoHover = (e: React.MouseEvent<SVGPathElement>, hoveredGeo: string) => {
    setActiveGeography("");
    geographyInfoTooltipRef.current?.open({
      position: {
        x: e.clientX,
        y: e.clientY,
      },
      place: "bottom",
      content: <GeographyDetail geo={hoveredGeo} geographies={geographiesWithCoords} />,
    });
  };

  const handleGeoLeave = () => {};

  const handleGeographySelected = (selectedCountry: TGeographyWithCoords) => {
    setActiveGeography(selectedCountry.display_value);
    setMapCenter(selectedCountry.coords);
    setMapZoom(5);
    const mapElement = mapRef.current;
    if (mapElement) {
      const mapRect = mapElement.getBoundingClientRect();
      const x = mapRect.left + mapRect.width / 2;
      const y = mapRect.top + mapRect.height / 2;
      geographyInfoTooltipRef.current?.open({
        position: {
          x,
          y,
        },
        place: "bottom",
        content: <GeographyDetail geo={selectedCountry.display_value} geographies={geographiesWithCoords} />,
      });
    }
  };

  const handleResetMapClick = () => {
    setMapCenter([0, 0]);
    setMapZoom(1);
    setActiveGeography("");
    geographyInfoTooltipRef.current?.close();
  };

  const openToolTip = (coords: [number, number], selectedGeography: string, centreMap: boolean, zoom: number) => {
    setActiveGeography("");
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
      <div ref={mapRef} className="map-container relative" data-cy="world-map">
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
                    onMouseLeave={handleGeoLeave}
                  />
                ))
              }
            </Geographies>
            {Object.keys(geographiesWithCoords).map((i) => {
              const geo = geographiesWithCoords[i];
              if (!geo.coords) return null;
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
                  onMouseLeave={handleGeoLeave}
                  style={markerStyle}
                >
                  <circle r={2} />
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
        <Tooltip id="mapToolTip" ref={geographyInfoTooltipRef} imperativeModeOnly clickable />
        <ZoomControls
          mapZoom={mapZoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          handleZoomIn={() => setMapZoom(mapZoom + 1)}
          handleZoomOut={() => setMapZoom(mapZoom - 1)}
          handleReset={handleResetMapClick}
        />
      </div>
    </>
  );
}
