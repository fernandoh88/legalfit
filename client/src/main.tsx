import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./ui/AppLayout";
import { HomePage } from "./pages/HomePage";
import { IntakePage } from "./pages/IntakePage";
import { ResultsPage } from "./pages/ResultsPage";
import { LawyerProfilePage } from "./pages/LawyerProfilePage";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "intake", element: <IntakePage /> },
      { path: "results", element: <ResultsPage /> },
      { path: "lawyers/:id", element: <LawyerProfilePage /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
