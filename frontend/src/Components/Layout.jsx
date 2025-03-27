import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import "./Layout.css";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="content">
        <Outlet />  {/* This dynamically renders the current page */}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
