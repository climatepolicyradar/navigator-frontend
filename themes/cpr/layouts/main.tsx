import React, { FC, ReactNode } from "react";
import Header from "@components/headers/Main";
import Footer from "@components/footer/Footer";

type TProps = {
  children?: ReactNode;
};

const Main: FC<TProps> = ({ children }) => (
  <>
    <Header />
    <main className="flex flex-col flex-1">{children}</main>
    <Footer />
  </>
);
export default Main;
