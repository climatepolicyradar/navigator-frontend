import React, { FC, ReactNode } from "react";
import { NavBar } from "@/components/organisms/navBar/NavBar";
import Footer from "@/components/footer/Footer";

type TProps = {
  children?: ReactNode;
};

const Main: FC<TProps> = ({ children }) => (
  <>
    <NavBar />
    <main className="flex flex-col flex-1">{children}</main>
    <Footer />
  </>
);
export default Main;
