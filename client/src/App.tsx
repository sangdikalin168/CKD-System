/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Outlet,
  Router,
  RootRoute,
  Route,
  RouterProvider,
} from "@tanstack/react-router";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { useEffect, useState } from "react";

import Ticket from "./pages/Ticket/Ticket";
import { Member } from "./pages/Member/Member";
import Login from "./pages/Login/Login";
import { useAuthContext } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Report } from "./pages/Report/Report";

// Create a root route
const rootRoute = new RootRoute({
  component: Root,
});

function Root() {
  const [toggleSidebar, setToggleSidebar] = useState(true);

  return (
    <div className="flex select-none">
      <div className="h-screen w-2/12 max-w-2/12">
        <Sidebar
          toggleSidebar={toggleSidebar}
          setToggleSidebar={setToggleSidebar}
        />
      </div>
      <div className="h-screen w-5/6 bg-slate-100">
        <Navbar setToggleSidebar={setToggleSidebar} />
        <div className="m-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="h-screen">
      <h1>404 Not Found</h1>
    </div>
  );
}

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/ticket",
  component: Ticket,
});
const membersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/members",
  component: Member,
});
const reportRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/income",
  component: Report,
});
const notFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "*",
  component: NotFound,
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
  indexRoute,
  membersRoute,
  reportRoute,
  notFoundRoute,
]);

// Create the router using your route tree
const router = new Router({ routeTree });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  //#region
  const { checkAuth, isAuthenticated, setIsLoading } = useAuthContext();
  const authenticate = async () => {
    await checkAuth();
    setIsLoading(false);
  };

  //#endregion

  const [connection, setConnection] = useState(navigator.onLine);

  function handleOffline() {
    setConnection(false);
  }
  function handleOnline() {
    setConnection(true);
  }

  useEffect(() => {
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [connection]);

  useEffect(() => {
    authenticate();
    postMessage({ payload: "removeLoading" }, "*");
  }, [checkAuth]);

  if (!connection) {
    return (
      <>
        <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
          <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
            <div className="relative">
              <div className="absolute">
                <div className="">
                  <h1 className="my-2 text-gray-800 font-bold text-2xl">
                    No Internet
                  </h1>
                  <p className="my-2 text-gray-800">
                    Sorry about that! Please visit our hompage to get where you
                    need to go.
                  </p>
                  <button className="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50">
                    Take me there!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  //If Not Auth Return Login Page
  if (!isAuthenticated) return <Login />;

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );

  // return <h2>www.google.com</h2>
}
export default App;
