import Layout from "@components/layouts/Main";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@components/map/Map"), {
  ssr: false,
});

const MapView = () => {
  return (
    <>
      <Layout title="Map view">
        <Map />
      </Layout>
    </>
  );
};

export default MapView;
