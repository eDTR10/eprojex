import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './index.css'
import { Suspense, lazy } from "react";

import NotFound from "./screens/notFound";
import Loader from './components/loader/loader.tsx';
import Loaderx from './components/loader/screenLoader.tsx';
const Page1= lazy(() =>
  wait(1300).then(() => import("./screens/page1.tsx"))
);





const Login = lazy(() =>
  wait(1300).then(() => import("./screens/Authentication/Login/Login.tsx"))
);





const Admin= lazy(() =>
  wait(1300).then(() => import("./screens/Admin/Admin.tsx"))
);

const DashboardMainContainer= lazy(() =>
  wait(1300).then(() => import("./screens/Admin/Dashboard/DashboardMainContainer.tsx"))
);

const ProjectsMainContainer= lazy(() =>
  wait(1300).then(() => import("./screens/Admin/Projects/ProjectsMainContainer.tsx"))
);

const EmployeeMainContainer= lazy(() =>
  wait(1300).then(() => import("./screens/Admin/Employee/EmployeeMainContainer.tsx"))
);

const SettingMainContainer= lazy(() =>
  wait(1300).then(() => import("./screens/Admin/Setting/SettingMainContainer.tsx"))
);

const AttendanceMainContainer= lazy(() =>
  wait(1300).then(() => import("./screens/Admin/Attendance/AttendanceMainContainer.tsx"))
);


const router = createBrowserRouter([
  {
    path: "/react-vite-supreme",
    element: 
    <Suspense fallback={<Loaderx />}>
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
          <DashboardMainContainer />
        </Suspense>
      </>,
      },
      {
        path: "/react-vite-supreme/admin/projects/",
        element: <>
        <Suspense fallback={<Loader />}>
          <ProjectsMainContainer />
        </Suspense>
      </>,
      },{
        path: "/react-vite-supreme/admin/attendance/",
        element: <>
        <Suspense fallback={<Loader />}>
          <AttendanceMainContainer />
        </Suspense>
      </>,
      },
      {
        path: "/react-vite-supreme/admin/employee/",
        element: <>
        <Suspense fallback={<Loader />}>
          <EmployeeMainContainer />
        </Suspense>
      </>,
      },
      {
        path: "/react-vite-supreme/admin/setting/",
        element: <>
        <Suspense fallback={<Loader />}>
          <SettingMainContainer />
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
