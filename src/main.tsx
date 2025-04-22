import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";

import './index.css'
import { Suspense, lazy } from "react";

import NotFound from "./screens/notFound";
import Loader from './components/loader/loader.tsx';
import Loaderx from './components/loader/screenLoader.tsx';






// const Login = lazy(() =>
//   wait(1300).then(() => import("./screens/Authentication/Login/Login.tsx"))
// );





const Admin = lazy(() =>
  wait(1300).then(() => import("./screens/Admin/Admin.tsx"))
);

const DashboardMainContainer = lazy(() =>
  wait(1300).then(() => import("./screens/Admin/Dashboard/DashboardMainContainer.tsx"))
);

const ProjectsMainContainer = lazy(() =>
  import("./screens/Admin/Projects/ProjectsMainContainer.tsx")
);

const EmployeeMainContainer = lazy(() =>
  wait(1300).then(() => import("./screens/Admin/Employee/EmployeeMainContainer.tsx"))
);

const SettingMainContainer = lazy(() =>
  wait(1300).then(() => import("./screens/Admin/Setting/SettingMainContainer.tsx"))
);

const AttendanceMainContainer = lazy(() =>
  wait(1300).then(() => import("./screens/Admin/Attendance/AttendanceMainContainer.tsx"))
);

const AttendanceMainContainer2 = lazy(() =>
  wait(1300).then(() => import("./screens/Attendance/AttendanceMainContainer.tsx"))
);

const router = createBrowserRouter([
  {
    path: "/eprojex",
    element:
      <Suspense fallback={<Loaderx />}>
        <AttendanceMainContainer2 />
      </Suspense>
    ,
  },
  {
    path: "/eprojex/admin",
    element: <Admin />,

    children: [
      {
        path: "/eprojex/admin",
        element: <Navigate to="/eprojex/admin/dashboard/" />,
      },
      {
        path: "/eprojex/admin/dashboard/",
        element: <>
          <Suspense fallback={<Loader />}>
            <DashboardMainContainer />
          </Suspense>
        </>,
      },
      {
        path: "/eprojex/admin/projects/",
        element: <>
          <Suspense fallback={<Loader />}>
            <ProjectsMainContainer />
          </Suspense>
        </>,
      },
      {
        path: "/eprojex/admin/employees/",
        element: <>
          <Suspense fallback={<Loader />}>
            <EmployeeMainContainer />
          </Suspense>
        </>,
      },
      {
        path: "/eprojex/admin/attendance/",
        element: <>
          <Suspense fallback={<Loader />}>
            <AttendanceMainContainer />
          </Suspense>
        </>,
      },
      {
        path: "/eprojex/admin/employee/",
        element: <>
          <Suspense fallback={<Loader />}>
            <EmployeeMainContainer />
          </Suspense>
        </>,
      },
      {
        path: "/eprojex/admin/setting/",
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

function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
