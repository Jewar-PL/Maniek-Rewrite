import { Outlet } from "react-router";

import Navbar from "@/components/navigation/Navbar";

// TODO: Finish the layout
function Layout() {
    return (
        <div className="m-0 p-0 overflow-hidden h-screen bg-[#E6E6E6]">
            <main className="relative bg-white m-8 rounded-4xl h-[calc(100vh-4rem)] z-1">
                <Outlet />
            </main>
            <Navbar />
        </div>
    )
}

export default Layout;