import { useRouter } from "next/router";
import { FC, ReactNode } from "react";

import Footer from "@/components/footer/Footer";
import { Header } from "@/cpr/components/Header";

export const navBarGradient = (
  <div className="sticky top-[128px] cols-3:top-[72px] -z-10 h-0">
    <div className="h-30 bg-linear-to-b from-gray-50 to-white" />
  </div>
);

interface IProps {
  children?: ReactNode;
}

const Main: FC<IProps> = ({ children }) => {
  const router = useRouter();

  const showGradient = router.pathname !== "/";

  return (
    <>
      <Header />
      {showGradient && navBarGradient}
      <main className="flex flex-col flex-1">{children}</main>
      <Footer />
    </>
  );
};

export default Main;
