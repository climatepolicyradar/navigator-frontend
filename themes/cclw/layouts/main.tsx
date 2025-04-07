import { FC, ReactNode } from "react";

import Footer from "@/cclw/components/Footer";
import Header from "@/cclw/components/Header";

type TProps = {
  children?: ReactNode;
};

const Main: FC<TProps> = ({ children }) => (
  <>
    <Header />
    <div className="h-[calc(100vh-128px)] md:h-[calc(100vh-72px)] flex flex-col justify-between overflow-y-auto">
      <main id="main" className="flex flex-col flex-1">
        {children}
      </main>
      <Footer />
    </div>
  </>
);
export default Main;
