import React, { useRef, useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, Graticule, Marker, Sphere, ZoomableGroup, Point as TPoint } from "react-simple-maps";
import useConfig from "@hooks/useConfig";
import { GEO_CENTER_POINTS } from "@constants/mapCentres";
import { TGeography } from "@types";
import { Tooltip, TooltipRefProps } from "react-tooltip";
import { LinkWithQuery } from "@components/LinkWithQuery";

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

const GeographyDetail = ({ geo, countries }: { geo: any; countries: TCountries }) => {
  const geography = Object.values(countries).find((country) => country.display_value === geo);
  return (
    <>
      {geography && (
        <>
          <p className="font-bold">{geography.display_value}</p>
          <p>
            <LinkWithQuery href={geography.slug}>View country profile</LinkWithQuery>
          </p>
        </>
      )}
      <p>Laws and policies: 24</p>
    </>
  );
};

export default function MapChart() {
  const configQuery = useConfig();
  const { data: { countries: configContries = [] } = {} } = configQuery;
  const geographyInfoTooltipRef = useRef<TooltipRefProps>(null);
  const mapRef = useRef(null);
  const [activeGeography, setActiveGeography] = useState("");
  const [mapCenter, setMapCenter] = useState<TPoint>([0, 0]);
  const [mapZoom, setMapZoom] = useState(1);
  const [tooltipContent, setTooltipContent] = useState("");

  const countries: TCountries = useMemo(
    () =>
      configContries.reduce((acc, country) => {
        acc[country.value] = { ...country, coords: GEO_CENTER_POINTS[country.value] };
        return acc;
      }, {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleGeoClick = (e: React.MouseEvent<SVGPathElement>, geo: TGeo) => {
    setActiveGeography(geo.properties.name);
    const geography = Object.values(countries).find((country) => country.display_value === geo.properties.name);
    // console.log("handleGeoClick - geography", geography, geo);
    if (geography) {
      // Not working because of tooltip placement
      // setMapCenter(geography.coords);
      // setMapZoom(3);
      geographyInfoTooltipRef.current?.open({
        position: {
          x: e.clientX,
          y: e.clientY,
        },
        place: "bottom",
        content: <GeographyDetail geo={geo.properties.name} countries={countries} />,
      });
    }
  };

  const handleMarkerClick = (countryCode: string) => {
    // console.log("countryCode", countryCode);
    const geography = countries[countryCode];
    setActiveGeography(geography?.display_value ?? "");
    setMapCenter(GEO_CENTER_POINTS[countryCode]);
    setMapZoom(3);
    //find centre of mapRef
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
        content: <GeographyDetail geo={geography?.display_value} countries={countries} />,
      });
    }
  };

  const handleGeoHover = (e: React.MouseEvent<SVGPathElement>, hoveredGeo: string) => {
    // setTooltipContent(hoveredGeo);
    geographyInfoTooltipRef.current?.open({
      position: {
        x: e.clientX,
        y: e.clientY,
      },
      place: "bottom",
      content: <GeographyDetail geo={hoveredGeo} countries={countries} />,
    });
  };

  const handleGeoLeave = () => {
    setTooltipContent("");
    // geographyInfoTooltipRef.current?.close();
  };

  // const handleResetMapClick = () => {
  //   setMapCenter([0, 0]);
  //   setMapZoom(1);
  //   setActiveGeography("");
  //   geographyInfoTooltipRef.current?.close();
  // };

  return (
    <div ref={mapRef} className="map-container my-8 relative">
      <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 120 }} height={340}>
        <ZoomableGroup
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
                  // data-tooltip-id="map-tooltip"
                  onMouseOver={(e) => {
                    handleGeoHover(e, geo.properties.name);
                  }}
                  onMouseLeave={handleGeoLeave}
                />
              ))
            }
          </Geographies>
          {Object.keys(GEO_CENTER_POINTS).map((point) => (
            <Marker
              key={point}
              // data-tooltip-id="map-tooltip"
              coordinates={GEO_CENTER_POINTS[point]}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleMarkerClick(point);
              }}
              onMouseOver={(e) => {
                handleGeoHover(e, point);
              }}
              onMouseLeave={handleGeoLeave}
              style={markerStyle}
            >
              <circle r={2} />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
      {/* <Tooltip className="customTooltip" id="map-tooltip" float>
        {tooltipContent}
      </Tooltip> */}
      {/* {activeGeography && (
        <div className="absolute bottom-12 right-12 p-4 border border-blue-600 bg-white">
          <GeographyDetail geo={activeGeography} countries={countries} />
        </div>
      )} */}
      <Tooltip id="mapToolTip" ref={geographyInfoTooltipRef} imperativeModeOnly clickable />
    </div>
  );
}
