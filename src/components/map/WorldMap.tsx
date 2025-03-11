import React, { useRef, useState, useMemo, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Graticule, Marker, Sphere, ZoomableGroup, Point as TPoint } from "react-simple-maps";
import { Tooltip, TooltipRefProps } from "react-tooltip";

import useConfig from "@hooks/useConfig";
import useGeographies from "@hooks/useGeographies";
import { useMcfData } from "@hooks/useMcfData";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import GeographySelect from "./GeographySelect";
import { ZoomControls } from "./ZoomControls";
import { Legend } from "./Legend";

import { TGeography } from "@types";

import { GEO_EU_COUNTRIES } from "@constants/mapEUCountries";
import { GEO_CENTER_POINTS } from "@constants/mapCentres";

const geoUrl = "/data/map/world-countries-50m.json";

type TSvgGeo = {
  geometry: { type: string; coordinates: TPoint[] };
  id: string;
  properties: { name: string };
  rsmKey: string;
  svgPath: string;
  type: string;
};

type TGeoFamilyCounts = {
  UNFCCC: number;
  EXECUTIVE: number;
  LEGISLATIVE: number;
  MCF: number;
  REPORTS: number;
};

type TGeoMarkers = {
  lawsPolicies: number;
  unfccc: number;
  mcf: number;
  reports: number;
};

type TGeographyWithCoords = TGeography & { coords: TPoint; familyCounts: TGeoFamilyCounts; markers: TGeoMarkers };

type TGeographiesWithCoords = { [key: string]: TGeographyWithCoords };

type TMapData = {
  maxLawsPolicies: number;
  maxUnfccc: number;
  maxMcf: number;
  maxReports: number;
  geographies: TGeographiesWithCoords;
};

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
    outline: "none",
    cursor: "pointer",
  },
  hover: {
    outline: "none",
    cursor: "pointer",
  },
  pressed: {
    outline: "none",
    cursor: "pointer",
  },
};

const MAX_ZOOM = 20;
const MIN_ZOOM = 1;
const maxMarkerSize = 10;
const minMarkerSize = 1.5;

const getMarkerColour = (value: number, min: number, max: number, active: boolean) => {
  if (active) {
    return "#1F93FF";
  }
  const offset = ((value - min) / (max - min)) * 100;
  return `hsl(200, 50%, ${100 - offset}%)`;
};

const getMarketStroke = (active: boolean) => {
  return active ? "#fff" : "#1D2939";
};

const GeographyDetail = ({ geo, geographies }: { geo: any; geographies: TGeographiesWithCoords }) => {
  const geography = Object.values(geographies).find((country) => country.display_value === geo);
  if (!geography || geography.value === "ESH") {
    return (
      <>
        <p>We do not have any information for this area yet. ({geo})</p>
      </>
    );
  }
  return (
    <>
      <p className="text-textDark font-medium">{geography.display_value}</p>
      {(geography.familyCounts?.EXECUTIVE || geography.familyCounts?.LEGISLATIVE) && (
        <p>Laws and policies: {(geography.familyCounts?.EXECUTIVE || 0) + (geography.familyCounts?.LEGISLATIVE || 0)}</p>
      )}
      {geography.familyCounts?.UNFCCC > 0 && <p>UNFCCC: {geography.familyCounts?.UNFCCC || 0}</p>}
      {geography.familyCounts?.MCF > 0 && <p>MCF projects: {geography.familyCounts?.MCF || 0}</p>}
      {geography.familyCounts?.REPORTS > 0 && <p>Reports: {geography.familyCounts?.REPORTS || 0}</p>}
      <p>
        <LinkWithQuery href={`/geographies/${geography.slug}`} className="text-blue-600 underline hover:text-blue-800">
          View more
        </LinkWithQuery>
      </p>
    </>
  );
};

export default function MapChart() {
  const configQuery = useConfig();
  const geographiesQuery = useGeographies();
  const { data: { countries: configCountries = [] } = {} } = configQuery;
  const { data: mapDataRaw = [], status: mapDataStatus } = geographiesQuery;
  const geographyInfoTooltipRef = useRef<TooltipRefProps>(null);
  const mapRef = useRef(null);
  const [activeGeography, setActiveGeography] = useState("");
  const [mapCenter, setMapCenter] = useState<TPoint>([0, 0]);
  const [mapZoom, setMapZoom] = useState(1);
  const [showUnifiedEU, setShowUnifiedEU] = useState(false);
  const [selectedFamCategory, setSelectedFamCategory] = useState<"lawsPolicies" | "unfccc" | "mcf" | "reports">("lawsPolicies");
  const showMcf = useMcfData();

  useEffect(() => {
    if (!showMcf && selectedFamCategory === "mcf") {
      setSelectedFamCategory("lawsPolicies");
    }
  }, [showMcf, selectedFamCategory]);

  // Combine the data from the coordinates and the map data from the API into a unified object
  const mapData: TMapData = useMemo(() => {
    // Calculate size of marker
    const maxLawsPolicies = mapDataRaw.length
      ? Math.max(...mapDataRaw.map((g) => (g.family_counts?.EXECUTIVE || 0) + (g.family_counts?.LEGISLATIVE || 0)))
      : 0;
    // Only take UNFCCC, Reports and MCF counts for countries that are not XAA or XAB (international, no geography)
    const maxMcf = mapDataRaw.length ? Math.max(...mapDataRaw.map((g) => (["XAA", "XAB"].includes(g.iso_code) ? 0 : g.family_counts?.MCF || 0))) : 0;
    const maxReports = mapDataRaw.length
      ? Math.max(...mapDataRaw.map((g) => (["XAA", "XAB"].includes(g.iso_code) ? 0 : g.family_counts?.REPORTS || 0)))
      : 0;
    const maxUnfccc = mapDataRaw.length
      ? Math.max(...mapDataRaw.map((g) => (["XAA", "XAB"].includes(g.iso_code) ? 0 : g.family_counts?.UNFCCC || 0)))
      : 0;

    const mapDataConstructor: TMapData = {
      maxLawsPolicies,
      maxUnfccc,
      maxMcf,
      maxReports,
      geographies: {},
    };

    mapDataConstructor.geographies = configCountries.reduce((acc, country) => {
      const geoStats = mapDataRaw.find((geo) => geo.slug === country.slug);
      const lawsPoliciesCount = (geoStats?.family_counts?.EXECUTIVE || 0) + (geoStats?.family_counts?.LEGISLATIVE || 0);

      // As the map has no where to display XAA or XAB data we don't need to fiddle with the count.
      const unfcccCount = geoStats?.family_counts?.UNFCCC || 0;
      const mcfCount = geoStats?.family_counts?.MCF || 0;
      const reportsCount = geoStats?.family_counts?.REPORTS || 0;

      acc[country.value] = {
        ...country,
        coords: GEO_CENTER_POINTS[country.value],
        familyCounts: geoStats?.family_counts,
        markers: {
          lawsPolicies: maxLawsPolicies > 0 ? Math.max(minMarkerSize, (lawsPoliciesCount / maxLawsPolicies) * maxMarkerSize) : 0,
          unfccc: maxUnfccc > 0 ? Math.max(minMarkerSize, (unfcccCount / maxUnfccc) * maxMarkerSize) : 0,
          mcf: maxMcf > 0 ? Math.max(minMarkerSize, (mcfCount / maxMcf) * maxMarkerSize) : 0,
          reports: maxReports > 0 ? Math.max(minMarkerSize, (reportsCount / maxReports) * maxMarkerSize) : 0,
        },
      };
      return acc;
    }, {});
    return mapDataConstructor;
  }, [configCountries, mapDataRaw]);

  const handleGeoClick = (e: React.MouseEvent<SVGPathElement>, geo: TSvgGeo) => {
    setActiveGeography(geo.properties.name);
    const geography = Object.values(mapData.geographies).find((g) => g.display_value === geo.properties.name);
    openToolTip([e.clientX, e.clientY], geography?.display_value ?? geo.properties.name);
  };

  const handleMarkerClick = (e: React.MouseEvent<SVGPathElement>, countryCode: string) => {
    const geography = mapData.geographies[countryCode];
    openToolTip([e.clientX, e.clientY], geography?.display_value ?? "");
  };

  const handleGeoHover = (e: React.MouseEvent<SVGPathElement>, hoveredGeo: string) => {
    setActiveGeography("");
    openToolTip([e.clientX, e.clientY], hoveredGeo);
  };

  const handleGeographySelected = (selectedCountry: TGeographyWithCoords) => {
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
      content: <GeographyDetail geo={selectedGeography} geographies={mapData.geographies} />,
    });
  };

  if (mapDataStatus === "loading") {
    return <p>Loading data for the map...</p>;
  }

  if (mapDataStatus === "error") {
    return <p>There was an error loading the data for the map.</p>;
  }

  return (
    <>
      <div className="flex justify-between items-center my-4">
        <div>
          <select
            className="border border-gray-300 small rounded-full !pl-4"
            onChange={(e) => {
              setSelectedFamCategory(e.currentTarget.value as "lawsPolicies" | "unfccc" | "mcf" | "reports");
            }}
            value={selectedFamCategory}
            aria-label="Select a document type to display on the map"
            name="Document type selector"
          >
            <option value="lawsPolicies">Laws and policies</option>
            <option value="unfccc">UNFCCC</option>
            {showMcf && <option value="mcf">MCF projects</option>}
            <option value="reports">Reports</option>
          </select>
        </div>
        <div>
          <div className="flex items-center gap-4">
            <div className="relative w-[300px]" data-cy="geographies">
              <GeographySelect
                title="Search for a country or territory"
                list={mapData.geographies}
                keyField="value"
                keyFieldDisplay="display_value"
                filterType="geography"
                handleFilterChange={(_, value) => {
                  handleGeographySelected(mapData.geographies[value]);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div ref={mapRef} className="map-container relative border border-gray-300" data-cy="world-map">
        <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 160 }} height={340}>
          <ZoomableGroup
            maxZoom={MAX_ZOOM}
            minZoom={MIN_ZOOM}
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
                  />
                ))
              }
            </Geographies>
            {mapDataStatus === "success" && (
              <>
                {Object.keys(mapData.geographies).map((i) => {
                  const geo = mapData.geographies[i];
                  if (!geo.coords) return null;
                  if (!showUnifiedEU && geo.value === "EUR") return null;
                  if (showUnifiedEU && GEO_EU_COUNTRIES.includes(geo.value)) return null;
                  if (geo.value === "ESH") return null; // Western Sahara (disputed territory)
                  if (!geo.markers[selectedFamCategory]) return null;
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
                      <circle
                        r={geo.markers[selectedFamCategory]}
                        fill={getMarkerColour(geo.markers[selectedFamCategory], minMarkerSize, maxMarkerSize, activeGeography === geo.display_value)}
                        stroke={getMarketStroke(activeGeography === geo.display_value)}
                        strokeWidth={0.25}
                      />
                    </Marker>
                  );
                })}
              </>
            )}
          </ZoomableGroup>
        </ComposableMap>
        <Tooltip id="mapToolTip" ref={geographyInfoTooltipRef} afterHide={() => setActiveGeography("")} imperativeModeOnly clickable />
        <ZoomControls
          mapZoom={mapZoom}
          maxZoom={MAX_ZOOM}
          minZoom={MIN_ZOOM}
          handleZoomIn={() => setMapZoom(mapZoom + 1)}
          handleZoomOut={() => setMapZoom(mapZoom - 1)}
          handleReset={handleResetMapClick}
        />
        <div className="absolute top-0 right-0 p-4">
          <label
            className="checkbox-input flex items-center p-2 px-4 rounded-full cursor-pointer border border-gray-300 bg-white"
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
            <span className="px-2 text-sm">Show aggregated EU data</span>
          </label>
        </div>
      </div>
      {!!mapData.maxLawsPolicies && !!mapData.maxUnfccc && (
        <Legend
          max={
            selectedFamCategory === "lawsPolicies"
              ? mapData.maxLawsPolicies
              : selectedFamCategory === "unfccc"
                ? mapData.maxUnfccc
                : selectedFamCategory === "reports"
                  ? mapData.maxReports
                  : mapData.maxMcf
          }
        />
      )}
    </>
  );
}
