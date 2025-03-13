import {
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import apiClient from "../../axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const createResource = async (body) => {
  const response = await apiClient.post(
    "/api/resources",
    JSON.stringify(body),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response;
};

export const Run = () => {
  const { serviceId, catalogItemId } = useParams();
  const navigate = useNavigate();

  const {
    isLoading,
    isSuccess,
    isError,
    data: catalogItem,
  } = useQuery({
    queryFn: () =>
      apiClient
        .get(`/api/services/${serviceId}/catalogItems/${catalogItemId}`)
        .then((res) => res.data),
    queryKey: ["get-catalog-item", catalogItemId],
  });

  const { isLoading: creatingResource, mutate: runCatalogItem } = useMutation({
    mutationFn: createResource,
    onSuccess: () => navigate("/resources"),
  });

  const [formElements, setFormElements] = useState({
    region: "",
    cloudProvider: "",
    installSoftwares: false,
    endDate: "",
    resourceName: "",
  });

  const handleChange = (event) => {
    setFormElements({
      ...formElements,
      [event.target.name]:
        event.target.name === "installSoftwares"
          ? event.target.checked
          : event.target.value,
    });
  };

  return (
    <>
      {isLoading && <p>Loading catalog item, please wait...</p>}
      {creatingResource && <p>Creating Resource, please wait...</p>}
      {isError && <p>Sorry! Failed to load catalog item...</p>}
      {isSuccess && (
        <div
          style={{
            border: "1px solid #bdbdbd",
            padding: "2%",
            marginTop: "2%",
          }}
        >
          <Typography
            sx={{
              color: "text.primary",
              fontWeight: "bold",
              fontSize: "24px",
              marginBottom: "1%",
            }}
          >
            Run {catalogItem.catalogItemName}
          </Typography>

          <TextField
            onChange={handleChange}
            id="resourceName"
            name="resourceName"
            label="Resource Name"
            variant="outlined"
            sx={{ width: "30%", marginBottom: "1%" }}
          />
          <br />

          <FormControlLabel
            control={
              <Checkbox
                value={formElements.installSoftwares}
                onClick={handleChange}
                name="installSoftwares"
                id="installSoftwares"
              />
            }
            label="Install Additional Softwares"
          />

          <InputLabel id="cloudProvider">Cloud Provider</InputLabel>
          <Select
            labelId="cloudProvider"
            id="cloudProvider"
            value={formElements.cloudProvider}
            label="Cloud Provider"
            onChange={handleChange}
            sx={{ width: "30%", marginBottom: "1%" }}
            name="cloudProvider"
          >
            <MenuItem value={"aws"}>AWS</MenuItem>
            <MenuItem value={"azure"}>AZURE</MenuItem>
            <MenuItem value={"gcp"}>GCP</MenuItem>
          </Select>

          <InputLabel id="region">Region</InputLabel>
          <Select
            labelId="region"
            id="region"
            value={formElements.region}
            label="Region"
            onChange={handleChange}
            sx={{ width: "30%", marginBottom: "1%" }}
            name="region"
          >
            <MenuItem value={"us-east"}>US East</MenuItem>
            <MenuItem value={"central-india"}>Central India</MenuItem>
            <MenuItem value={"london"}>London</MenuItem>
          </Select>

          <InputLabel id="endDate">End Date</InputLabel>
          <input
            label="End Date"
            type="datetime-local"
            style={{ padding: "1%", width: "30%", fontSize: "16px" }}
            onChange={handleChange}
            name="endDate"
            id="endDate"
          />

          <br />
          <br />
          <Button
            variant="contained"
            onClick={() =>
              runCatalogItem({
                ...formElements,
                skuName: catalogItem?.catalogItemName,
              })
            }
          >
            Run
          </Button>
        </div>
      )}
    </>
  );
};
