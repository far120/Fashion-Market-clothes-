import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
export default function RootRoute() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}