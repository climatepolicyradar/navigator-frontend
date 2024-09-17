import React, { FC, ReactNode } from "react";
import { PageHeader } from "@components/headers/PageHeader";
import Footer from "@components/footer/Footer";

type TProps = {
  children?: ReactNode;
};

const Main: FC<TProps> = ({ children }) => (
  <>
    <PageHeader />
    <main id="main" className="flex flex-col flex-1">
      {children}
    </main>
    <Footer />
  </>
);
export default Main;
