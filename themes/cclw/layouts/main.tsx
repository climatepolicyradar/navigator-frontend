import { FC, ReactNode } from "react";

import Footer from "@/cclw/components/Footer";
import { Header } from "@/cclw/components/Header";

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
