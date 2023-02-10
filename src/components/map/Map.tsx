import { useState } from "react";
import Script from "next/script";
import Head from "next/head";
import { MapContainer, Popup, GeoJSON } from "react-leaflet";
import GeoJsonData from "../../../public/data/world-m.geo.json";
import { CountryLink } from "@components/CountryLink";

type TMapStyleOptions = {
  stroke?: boolean;
  color?: string;
  weight?: number;
  opacity?: number;
  dashArray?: string;
  dashOffset?: string;
  fill?: boolean;
  fillColor?: string;
  fillOpacity?: number;
  bubblingMouseEvents?: boolean;
  className?: string;
};

type TPopup = {
  position: [number, number];
  country: string;
  countryCode: string;
};

type TProps = {
  startingZoom?: number;
};

const Map = ({ startingZoom }: TProps) => {
  const [popup, setPopup] = useState<TPopup>(null);
  const mapData: any = GeoJsonData;
  const baseStyle: TMapStyleOptions = {
    stroke: true,
    color: "#5e5e5e",
    weight: 1.2,
    opacity: 0.4,
    fill: true,
    fillColor: "#fff",
    fillOpacity: 1,
  };

  // Listen for interactions with the feature / geography
  // Save the feature/layer/geo info into state and dynamically populate the popup component with the data
  const geoClickHandler = (e: any) => {
    const geoDetails = e.layer?.feature?.properties;
    setPopup({ position: [e.latlng.lat, e.latlng.lng], country: geoDetails.admin, countryCode: geoDetails.adm0_a3 });
    return false;
  };

  const geoMouseOverHandler = (e: any) => {
    const geoLayer = e.layer;
    geoLayer.bringToFront();
    geoLayer.setStyle({
      opacity: 0.8,
      weight: 2
    });
    return false;
  };

  const geoMouseOutHandler = (e: any) => {
    const geoLayer = e.layer;
    geoLayer.setStyle(baseStyle);
    return false;
  };

  const geoEventHandlers = {
    click: geoClickHandler,
    mouseover: geoMouseOverHandler,
    mouseout: geoMouseOutHandler,
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
          integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
          crossOrigin=""
        />
      </Head>
      <Script
        src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
        integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM="
        crossOrigin=""
      ></Script>
      <MapContainer className="h-full w-full worldMap" center={[51.505, -0.09]} zoom={startingZoom ?? 2} minZoom={2} maxZoom={9} scrollWheelZoom={true}>
        <GeoJSON data={mapData} style={baseStyle} eventHandlers={geoEventHandlers} />
        {popup && (
          <Popup position={popup.position} className="worldMap--popup">
            <h5>{popup.country}</h5>
            {popup.countryCode && (
              <div className="mt-2">
                <CountryLink countryCode={popup.countryCode} emptyContentFallback={<>We don't have details for this country yet</>}>
                  View details for {popup.country}
                </CountryLink>
              </div>
            )}
          </Popup>
        )}
      </MapContainer>
    </>
  );
};

export default Map;
