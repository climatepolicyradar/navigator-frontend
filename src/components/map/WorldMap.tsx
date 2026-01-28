import React, { useRef, useState, useMemo, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ComposableMap, Geographies, Geography, Graticule, Marker, Sphere, ZoomableGroup, Point as TPoint } from "react-simple-maps";
import { Tooltip, TooltipRefProps } from "react-tooltip";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { EXCLUDED_ISO_CODES } from "@/constants/geography";
import { GEO_CENTER_POINTS } from "@/constants/mapCentres";
import { GEO_EU_COUNTRIES } from "@/constants/mapEUCountries";
import useConfig from "@/hooks/useConfig";
import useGeographies from "@/hooks/useGeographies";
import { useMcfData } from "@/hooks/useMcfData";
import { TGeography, TTheme } from "@/types";

import GeographySelect from "./GeographySelect";
import { Legend } from "./Legend";
import { ZoomControls } from "./ZoomControls";
import { ExternalLink } from "../ExternalLink";
import { Heading } from "../typography/Heading";

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
  LITIGATION: number;
};

type TGeoMarkers = {
  lawsPolicies: number;
  unfccc: number;
  mcf: number;
  reports: number;
  litigation: number;
};

export type TGeographyWithCoords = TGeography & {
  coords: TPoint;
  familyCounts: TGeoFamilyCounts;
  markers: TGeoMarkers;
};

export type TGeographiesWithCoords = { [key: string]: TGeographyWithCoords };

type TMapData = {
  maxLawsPolicies: number;
  maxUnfccc: number;
  maxMcf: number;
  maxReports: number;
  maxLitigation: number;
  geographies: TGeographiesWithCoords;
};

// For converting Hex to HSL for use in our calculation
// https://htmlcolors.com/hex-to-hsl
const geoStyle = (isActive: boolean, count: number, max: number) => {
  const maxLog = Math.log10(max);
  const countLog = Math.log10(count || 1);

  const ratio = countLog / maxLog;
  const fillLightness = count === 0 ? 80 : 60 - ratio * 25;

  return {
    default: {
      fill: isActive ? "#002CA3" : `hsl(206, 14%, ${fillLightness}%)`,
      stroke: "#fff",
      strokeWidth: 0.25,
      outline: "none",
    },
    hover: {
      fill: "#002CA3",
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
    return "#002CA3";
  }
  const offset = ((value - min) / (max - min)) * 100;
  return `hsl(200, 50%, ${100 - offset}%)`;
};

const getMarkerStroke = (active: boolean) => {
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
      {(geography.familyCounts?.EXECUTIVE > 0 || geography.familyCounts?.LEGISLATIVE > 0) && (
        <p>Laws and policies: {(geography.familyCounts?.EXECUTIVE || 0) + (geography.familyCounts?.LEGISLATIVE || 0)}</p>
      )}
      {geography.familyCounts?.UNFCCC > 0 && <p>UNFCCC: {geography.familyCounts?.UNFCCC || 0}</p>}
      {geography.familyCounts?.MCF > 0 && <p>MCF projects: {geography.familyCounts?.MCF || 0}</p>}
      {geography.familyCounts?.REPORTS > 0 && <p>Reports: {geography.familyCounts?.REPORTS || 0}</p>}
      {geography.familyCounts?.LITIGATION > 0 ? <p>Litigation: {geography.familyCounts?.LITIGATION || 0}</p> : <p>No litigation data available</p>}
      <p>
        <LinkWithQuery
          href={`/geographies/${geography.slug}`}
          className="text-blue-600 underline hover:text-blue-800"
          data-ph-capture-attribute-link-purpose="map-view-more"
          data-ph-capture-attribute-country={geography.slug}
        >
          View more
        </LinkWithQuery>
      </p>
    </>
  );
};

interface IProps {
  showLitigation?: boolean;
  showCategorySelect?: boolean;
  showEUCheckbox?: boolean;
  theme: TTheme;
}

export default function WorldMap({ showLitigation = false, showCategorySelect = true, showEUCheckbox = false, theme }: IProps) {
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
  const [selectedFamCategory, setSelectedFamCategory] = useState<"lawsPolicies" | "unfccc" | "mcf" | "reports" | "litigation">("lawsPolicies");
  const showMcf = useMcfData();

  useEffect(() => {
    if (theme === "ccc") {
      setSelectedFamCategory("litigation");
    }
  }, [theme]);

  // Combine the data from the coordinates and the map data from the API into a unified object
  const mapData: TMapData = useMemo(() => {
    // Calculate size of marker
    const maxLawsPolicies = mapDataRaw.length
      ? Math.max(...mapDataRaw.map((g) => (g.family_counts?.EXECUTIVE || 0) + (g.family_counts?.LEGISLATIVE || 0)))
      : 0;
    // Only take UNFCCC, Reports and MCF counts for countries that are not XAA or XAB (international, no geography)
    const maxMcf = mapDataRaw.length
      ? Math.max(...mapDataRaw.map((g) => (EXCLUDED_ISO_CODES.includes(g.iso_code) ? 0 : g.family_counts?.MCF || 0)))
      : 0;
    const maxReports = mapDataRaw.length
      ? Math.max(...mapDataRaw.map((g) => (EXCLUDED_ISO_CODES.includes(g.iso_code) ? 0 : g.family_counts?.REPORTS || 0)))
      : 0;
    const maxUnfccc = mapDataRaw.length
      ? Math.max(...mapDataRaw.map((g) => (EXCLUDED_ISO_CODES.includes(g.iso_code) ? 0 : g.family_counts?.UNFCCC || 0)))
      : 0;
    const maxLitigation = mapDataRaw.length
      ? Math.max(...mapDataRaw.map((g) => (EXCLUDED_ISO_CODES.includes(g.iso_code) ? 0 : g.family_counts?.LITIGATION || 0)))
      : 0;

    const mapDataConstructor: TMapData = {
      maxLawsPolicies,
      maxUnfccc,
      maxMcf,
      maxReports,
      maxLitigation,
      geographies: {},
    };

    mapDataConstructor.geographies = configCountries.reduce<TGeographiesWithCoords>((acc, country) => {
      const geoStats = mapDataRaw.find((geo) => geo.slug === country.slug);
      const lawsPoliciesCount = (geoStats?.family_counts?.EXECUTIVE || 0) + (geoStats?.family_counts?.LEGISLATIVE || 0);

      // As the map has no where to display XAA or XAB data we don't need to fiddle with the count.
      const unfcccCount = geoStats?.family_counts?.UNFCCC || 0;
      const mcfCount = geoStats?.family_counts?.MCF || 0;
      const reportsCount = geoStats?.family_counts?.REPORTS || 0;

      acc[country.display_value] = {
        ...country,
        coords: GEO_CENTER_POINTS[country.value],
        familyCounts: geoStats?.family_counts,
        markers: {
          lawsPolicies: maxLawsPolicies > 0 ? Math.max(minMarkerSize, (lawsPoliciesCount / maxLawsPolicies) * maxMarkerSize) : 0,
          unfccc: maxUnfccc > 0 ? Math.max(minMarkerSize, (unfcccCount / maxUnfccc) * maxMarkerSize) : 0,
          mcf: maxMcf > 0 ? Math.max(minMarkerSize, (mcfCount / maxMcf) * maxMarkerSize) : 0,
          reports: maxReports > 0 ? Math.max(minMarkerSize, (reportsCount / maxReports) * maxMarkerSize) : 0,
          litigation: minMarkerSize,
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

  const handleMarkerClick = (e: React.MouseEvent<SVGGElement>, countryCode: string) => {
    const geography = mapData.geographies[countryCode];
    openToolTip([e.clientX, e.clientY], geography?.display_value ?? "");
  };

  const handleGeoHover = (e: React.MouseEvent<SVGGElement>, hoveredGeo: string) => {
    setActiveGeography("");
    openToolTip([e.clientX, e.clientY], hoveredGeo);
  };

  const handleGeographySelected = (selectedCountry: TGeographyWithCoords) => {
    if (!selectedCountry || !selectedCountry.coords) return;
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

  if (mapDataStatus === "pending") {
    return <p>Loading data for the map...</p>;
  }

  if (mapDataStatus === "error") {
    return <p>There was an error loading the data for the map.</p>;
  }

  const getMaxValue = () => {
    switch (selectedFamCategory) {
      case "lawsPolicies":
        return mapData.maxLawsPolicies;
      case "unfccc":
        return mapData.maxUnfccc;
      case "reports":
        return mapData.maxReports;
      case "mcf":
        return mapData.maxMcf;
      case "litigation":
        return mapData.maxLitigation;
      default:
        return mapData.maxLawsPolicies;
    }
  };

  return (
    <ErrorBoundary fallback={<div>Sorry. The map has failed to load.</div>}>
      <div className="flex justify-between items-center my-4">
        <Heading level={2}>Search the globe</Heading>
        {showCategorySelect && (
          <div>
            <select
              className="border border-gray-300 small rounded-full pl-4!"
              onChange={(e) => {
                setSelectedFamCategory(e.currentTarget.value as "lawsPolicies" | "unfccc" | "mcf" | "reports" | "litigation");
              }}
              value={selectedFamCategory}
              aria-label="Select a document type to display on the map"
              name="Document type selector"
            >
              <option value="lawsPolicies">Laws and policies</option>
              <option value="unfccc">UNFCCC</option>
              {showMcf && <option value="mcf">MCF projects</option>}
              <option value="reports">Reports</option>
              {showLitigation && <option value="litigation">Litigation</option>}
            </select>
          </div>
        )}

        <div>
          <div className="flex items-center gap-4">
            <div className="relative w-[300px]" data-cy="geographies">
              <GeographySelect
                title="Search for a country or territory"
                list={mapData.geographies}
                keyField="display_value"
                keyFieldDisplay="display_value"
                filterType="geography"
                handleFilterChange={(_, value) => {
                  handleGeographySelected(mapData.geographies[value]); //TODO: fix this because we are using the name as key
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div ref={mapRef} className="map-container relative" data-cy="world-map">
        <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 125 }} height={340}>
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
                geographies.map((geo, i) => {
                  const geoData = mapData.geographies[geo.properties.name];
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={geoStyle(activeGeography === geo.properties.name, geoData?.familyCounts.LITIGATION || 0, mapData.maxLitigation)}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleGeoClick(e, geo);
                      }}
                      onMouseOver={(e) => {
                        handleGeoHover(e, geo.properties.name);
                      }}
                    />
                  );
                })
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
                        stroke={getMarkerStroke(activeGeography === geo.display_value)}
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
        {showEUCheckbox && (
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
        )}
      </div>
      {selectedFamCategory !== "litigation" ? (
        <Legend max={getMaxValue()} showMcf={showMcf} showLitigation={showLitigation} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 text-center text-sm font-normal leading-none py-4">
          <p className="text-text-secondary">Darker color indicates the number of litigation submissions in our databases.</p>
          <p className="text-text-tertiary">
            This map uses the{" "}
            <ExternalLink className="underline" url="https://www.iso.org/iso-3166-country-codes.html">
              ISO 3166
            </ExternalLink>{" "}
            country code standard and is without prejudice to the status of or sovereignty over any territory.
          </p>
        </div>
      )}
    </ErrorBoundary>
  );
}
