import React, { FC, ReactNode } from "react";

import { Header, Footer } from "@/mcf/components";

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
