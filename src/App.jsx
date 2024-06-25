import { lazy, Suspense, createContext, useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

const Home = lazy(() => import("./views/Home"));
const Error = lazy(() => import("./views/Error"));
const ParcoursView = lazy(() => import("./views/ParcoursView"));
const SingleParcoursView = lazy(() => import("./views/ParcoursSingleView"));
const TreksView = lazy(()=> import("./views/TreksView"));
const SingleTrekView = lazy(() => import("./views/TrekSingleView"));
const GuidesView = lazy(() => import("./views/GuidesView"));
const SingleGuideView = lazy(() => import("./views/GuideSingleView"));
const ClientsView = lazy(() => import("./views/ClientsView"));
const SingleClientView = lazy(() => import("./views/ClientSingleView"));
const ProfileView = lazy(() => import("./views/ProfileView"));
const AdminsView = lazy(() => import("./views/AdminsView"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense>
         <Home />
      </Suspense>
    ),
    errorElement: <Error />,
  },
  {
    path: "/parcours",
    element: (
      <Suspense>
        <ParcoursView />
      </Suspense>
    )
  },
  {
    path: "/parcours/:slug",
    element: (
      <Suspense>
        <SingleParcoursView />
      </Suspense>
    )
  },
  {
    path: "/treks",
    element: (
      <Suspense>
        <TreksView />
      </Suspense>
    )
  },
  {
    path: "/treks/:slug",
    element: (
      <Suspense>
        <SingleTrekView />
      </Suspense>
    )
  },
  {
    path: "/guides",
    element: (
      <Suspense>
        <GuidesView />
      </Suspense>
    )
  },
  {
    path: "/guides/:slug",
    element: (
      <Suspense>
        <SingleGuideView />
      </Suspense>
    )
  },
  {
    path: "/clients",
    element: (
      <Suspense>
        <ClientsView />
      </Suspense>
    )
  },
  {
    path: "/clients/:slug",
    element: (
      <Suspense>
        <SingleClientView />
      </Suspense>
    )
  },
  {
    path: "/my-profile",
    element: (
      <Suspense>
        <ProfileView />
      </Suspense>
    )
  },
  {
    path: "/administrator",
    element: (
      <Suspense>
        <AdminsView />
      </Suspense>
    )
  }
]);

export const UserConnect = createContext();

function App() {

  useEffect(() => {
    getUser();
  }, []);

  const [userLog, setUserLog] = useState([]);

  async function getUser() {
    const token = localStorage.getItem("token");
    console.log("token " + token);
    if (!token)
    {
      setUserLog(null);
    }
    const options = {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
      },
    };
      const result = await fetch(`http://127.0.0.1:3001/login/userinfos`, options);
      let data = await result.json();
      if (data.message !== "Token invalide") {
        setUserLog(data);
      }
  }

  function disconnect()
  {
    setUserLog(null); 
    localStorage.removeItem("token");
  }

  return (
    <div className="App">
      <UserConnect.Provider value={{ userLog, setUserLog, disconnect }}>
        <RouterProvider router={router} />
      </UserConnect.Provider>
    </div>
  );
}

export default App;

