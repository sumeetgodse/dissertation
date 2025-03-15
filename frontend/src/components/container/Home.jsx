import { Navigate, Route, Routes } from "react-router-dom";
import { Services } from "../services/Services";
import { BreadCrumbs } from "./BreadCrumbs";
import { CatalogItems } from "../services/CatalogItems";
import { Run } from "../services/Run";
import { Login } from "./Login";
import { MyResources } from "../../resources/MyResources";
import { Admin } from "../admin/Admin";

export const Home = () => {
  return (
    <div>
      <BreadCrumbs />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/resources" />} />
        <Route path="/resources" element={<MyResources />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:serviceId" element={<CatalogItems />} />
        <Route
          path="/services/:serviceId/run/:catalogItemId"
          element={<Run />}
        />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
};
