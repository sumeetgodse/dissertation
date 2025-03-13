import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../axios";

export const MyResources = () => {
  const {
    isLoading,
    isSuccess,
    isError,
    data: resources,
  } = useQuery({
    queryFn: () => apiClient.get("/api/resources").then((res) => res.data),
    queryKey: ["get-my-resources"],
  });

  return (
    <>
      {isLoading && <p>Loading items, please wait...</p>}
      {isError && <p>Sorry! Failed to load resources...</p>}
      {isSuccess && resources.length === 0 && (
        <p>Sorry! You do not have any resources...</p>
      )}
      {isSuccess &&
        resources.length > 0 &&
        resources?.map((resource) => {
          return (
            <Card
              key={resource.resourceId}
              sx={{ width: 300, margin: "1%", float: "left" }}
            >
              <CardMedia
                style={{ height: "150px", width: "150px", margin: "0 auto" }}
                image="/resource.png"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {resource.resourceName}
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                  {resource.skuName}
                </Typography>
              </CardContent>
              <CardActions
                style={{ display: "flex", flexDirection: "row-reverse" }}
              >
                <Button size="small">Info</Button>
                <Button
                  size="small"
                  onClick={() => window.open("https://mui.com/", "_blank")}
                >
                  Launch
                </Button>
              </CardActions>
            </Card>
          );
        })}
    </>
  );
};
