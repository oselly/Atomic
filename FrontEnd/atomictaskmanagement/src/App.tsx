import React from "react";
import { Routes, Route } from "react-router-dom";
import BaseLayout from "./layouts/BaseLayout";
import Home from "./pages/Home";
import Tasks from "./pages/tasks/Tasks";
import Users from "./pages/users/Users";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
    return (
        <div>
            <Navbar />
            <main className="p-4">
                <Routes>
                    <Route element={<BaseLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/users" element={<Users />} />
                    </Route>
                </Routes>
            </main>
        </div>
    );
};

export default App;
