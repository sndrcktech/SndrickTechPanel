import React from "react";
import Sidebar from "./Sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex h-screen">
    <Sidebar />
    <main className="flex-1 bg-gray-100">{children}</main>
  </div>
);

export default Layout;
