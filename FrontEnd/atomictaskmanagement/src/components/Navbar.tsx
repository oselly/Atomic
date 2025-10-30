import React from "react";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
    return (
        <nav className="flex gap-4 bg-gray-100 p-3">
            <NavLink to="/" className={({ isActive }) => (isActive ? "font-bold text-blue-600" : "")}>
                Home
            </NavLink>
            <NavLink to="/tasks" className={({ isActive }) => (isActive ? "font-bold text-blue-600" : "")}>
                Tasks
            </NavLink>
        </nav>
    );
};

export default Navbar;
