import React, { FC, ReactNode } from "react";

import Footer from "@/mcf/components/Footer";
import { Header } from "@/mcf/components/Header";

interface IProps {
  children?: ReactNode;
}

const Main: FC<IProps> = ({ children }) => (
  <>
    <Header />
    <main id="main" className="flex flex-col flex-1">
      {children}
    </main>
    <Footer />
  </>
);
export default Main;
