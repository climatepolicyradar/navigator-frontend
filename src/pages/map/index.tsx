import Layout from "@components/layouts/Main";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@components/map/Map"), {
  ssr: false,
});

const SimpleMap = dynamic(() => import("@components/map/SimpleMap"), {
  ssr: false,
});

const MapView = () => {
  return (
    <>
      <Layout title="Map view">
        {/* <div className="container"> */}
          <Map />
          {/* <SimpleMap /> */}
        {/* </div> */}
      </Layout>
    </>
  );
};

export default MapView;
