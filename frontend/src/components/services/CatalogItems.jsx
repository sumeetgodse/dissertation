import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import apiClient from "../../axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export const CatalogItems = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const {
    isLoading,
    isSuccess,
    isError,
    data: catalogItems,
  } = useQuery({
    queryFn: () =>
      apiClient
        .get(`/api/services/${serviceId}/catalogItems`)
        .then((res) => res.data),
    queryKey: ["get-catalog-items", serviceId],
  });

  return (
    <>
      {isLoading && <p>Loading items, please wait...</p>}
      {isError && <p>Sorry! Failed to load catalog items...</p>}
      {isSuccess &&
        catalogItems.data?.map((catalogItem) => {
          return (
            <Card
              key={catalogItem.catalogItemId}
              sx={{ width: 300, margin: "1%", float: "left" }}
            >
              <CardMedia
                style={{ height: "150px", width: "150px", margin: "0 auto" }}
                image="/product.png"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {catalogItem.catalogItemName}
                </Typography>
              </CardContent>
              <CardActions
                style={{ display: "flex", flexDirection: "row-reverse" }}
              >
                <Button
                  size="small"
                  onClick={() =>
                    navigate(
                      `/services/${catalogItem.serviceId}/run/${catalogItem.catalogItemId}`,
                    )
                  }
                >
                  Run
                </Button>
              </CardActions>
            </Card>
          );
        })}
    </>
  );
};
