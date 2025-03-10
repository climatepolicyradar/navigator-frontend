import React, { FC, ReactNode } from "react";

import Footer from "@/cclw/components/Footer";
import Header from "@/cclw/components/Header";

type TProps = {
  children?: ReactNode;
};

const Main: FC<TProps> = ({ children }) => (
  <>
    <Header />
    <main id="main" className="flex flex-col flex-1">
      {children}
    </main>
    <Footer />
  </>
);
export default Main;
