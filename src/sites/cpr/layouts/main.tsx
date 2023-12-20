import React, { FC, ReactNode } from "react";
import Header from "@components/headers/Main";
import Footer from "@components/footer/Footer";

type TProps = {
  screenHeight?: boolean;
  children?: ReactNode;
};

const Main: FC<TProps> = ({ screenHeight, children }) => (
  <>
    <Header />
    <main id="main" className={`${screenHeight ? "h-screen" : ""} flex flex-col flex-1`}>
      {children}
    </main>
    <Footer />
  </>
);
export default Main;
