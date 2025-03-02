import { Navigate, Route, Routes } from "react-router-dom";
import { Services } from "../services/Services";
import { BreadCrumbs } from "./BreadCrumbs";
import { CatalogItems } from "../services/CatalogItems";
import { Run } from "../services/Run";
import { Login } from "./Login";

export const Home = () => {
  return (
    <div>
      <BreadCrumbs />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/resources" />} />
        <Route path="/resources" element={<h1>My Resources</h1>} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:serviceId" element={<CatalogItems />} />
        <Route
          path="/services/:serviceId/run/:catalogItemId"
          element={<Run />}
        />
        <Route path="/admin" element={<h1>Admin UI</h1>} />
      </Routes>
    </div>
  );
};
