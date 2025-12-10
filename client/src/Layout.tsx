import { Outlet } from "react-router";

import Navbar from "@/components/Navbar";

// TODO: Finish the layout
function Layout() {
    return (
        <div>
            <Outlet />
            <Navbar />
        </div>
    )
}

export default Layout;