import React, { FC, ReactNode } from "react";

import Footer from "@/components/footer/Footer";
import { PageHeader } from "@/components/headers/PageHeader";

type TProps = {
  children?: ReactNode;
};

const Main: FC<TProps> = ({ children }) => (
  <>
    <PageHeader />
    <main className="flex flex-col flex-1">{children}</main>
    <Footer />
  </>
);
export default Main;
