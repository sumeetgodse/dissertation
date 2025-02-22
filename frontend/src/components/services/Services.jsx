import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { apiClient } from "../../axios";
import { useQuery } from "@tanstack/react-query";

export const Services = () => {
  const {
    isLoading,
    isSuccess,
    isError,
    data: services,
  } = useQuery({
    queryFn: () => apiClient.get("/api/services").then((res) => res.data),
    queryKey: ["get-services"],
  });

  return (
    <>
      {isLoading && <p>Loading services, please wait...</p>}
      {isError && <p>Sorry! Failed to load services...</p>}
      {isSuccess &&
        services.data?.map((service) => {
          return (
            <Card
              key={service.serviceId}
              sx={{ width: 300, margin: "1%", float: "left" }}
            >
              <CardMedia
                style={{ height: "150px", width: "150px", margin: "0 auto" }}
                image="/services.png"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {service.serviceName}
                </Typography>
              </CardContent>
              <CardActions
                style={{ display: "flex", flexDirection: "row-reverse" }}
              >
                <Button size="small">Open</Button>
              </CardActions>
            </Card>
          );
        })}
    </>
  );
};
