import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useLocation, useNavigate } from "react-router-dom";

const allowedPaths = [
  "services",
  "resources",
  "admin",
  "product-services",
  "custom-vm-services",
  "run",
];
const pathToName = {
  services: "Service Catalog",
  resources: "My Resources",
  admin: "Admin",
  "product-services": "Product Services",
  "custom-vm-services": "Custom VM Services",
  run: "Run Catalog Item",
};
const nameToPath = {
  "Service Catalog": "/services",
  "My Resources": "/resources",
  Admin: "/admin",
  "Product Services": "/services/product-services",
  "Custom VM Services": "/services/custom-vm-services",
};

export const BreadCrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {location.pathname
        .split("/")
        .filter((path) => allowedPaths.includes(path))
        .map((path) => {
          return nameToPath[pathToName[path]] ? (
            <Link
              key={path}
              underline="hover"
              color="inherit"
              className="breadcrumb-link"
              onClick={() => navigate(nameToPath[pathToName[path]])}
            >
              {pathToName[path]}
            </Link>
          ) : (
            <Typography
              key={path}
              className="breadcrumb-link"
              sx={{ color: "text.primary" }}
            >
              {pathToName[path]}
            </Typography>
          );
        })}
    </Breadcrumbs>
  );
};
