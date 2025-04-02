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
        <Outlet />  
      </main>
      <Footer />
    </>
  );
};

export default Layout;
