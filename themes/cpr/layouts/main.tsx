import { useRouter } from "next/router";
import { FC, ReactNode } from "react";

import Footer from "@/components/footer/Footer";
import { Header } from "@/cpr/components/Header";
import { NavBarGradient } from "@/cpr/components/NavBarGradient";

interface IProps {
  children?: ReactNode;
}

const Main: FC<IProps> = ({ children }) => {
  const router = useRouter();

  const showGradient = router.pathname !== "/";

  return (
    <>
      <Header />
      {showGradient && <NavBarGradient />}
      <main className="flex flex-col flex-1">{children}</main>
      <Footer />
    </>
  );
};

export default Main;
