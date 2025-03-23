import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import "./Layout.css";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="content">
        <Outlet />  {/* This dynamically renders the current page */}
      </main>
    </>
  );
};

export default Layout;
