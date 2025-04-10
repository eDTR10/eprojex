import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './index.css'
import { Suspense, lazy } from "react";

import NotFound from "./screens/notFound";
import Loader from './components/loader/loader.tsx';

const Page1= lazy(() =>
  wait(1300).then(() => import("./screens/page1.tsx"))
);





const Login = lazy(() =>
  wait(1300).then(() => import("./screens/Authentication/Login/Login.tsx"))
);

const Page2= lazy(() =>
  wait(1300).then(() => import("./screens/page2.tsx"))
);



const Admin= lazy(() =>
  wait(1300).then(() => import("./screens/Admin/Admin.tsx"))
);

const router = createBrowserRouter([
  {
    path: "/react-vite-supreme",
    element: 
    <Suspense fallback={<Loader />}>
      <Login />
    </Suspense>
    ,
  },
  {
    path: "/react-vite-supreme/admin",
    element: <Admin/>,
    
    children: [
      {
        path: "/react-vite-supreme/admin", 
        element: <Navigate to="/react-vite-supreme/admin/dashboard/" />, 
      },
      {
        path: "/react-vite-supreme/admin/dashboard/",
        element: <>
        <Suspense fallback={<Loader />}>
          <Page2 />
        </Suspense>
      </>,
      },
      



      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function wait( time:number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
