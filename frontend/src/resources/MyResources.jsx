import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../axios";
import { destroyResource } from "./utils";

export const MyResources = () => {
  const queryClient = useQueryClient();

  const {
    isLoading,
    isSuccess,
    isError,
    data: resources,
  } = useQuery({
    queryFn: () => apiClient.get("/api/resources").then((res) => res.data),
    queryKey: ["get-my-resources"],
  });

  const { isLoading: destroyingResource, mutate: destroy } = useMutation({
    mutationFn: destroyResource,
    onSuccess: () => queryClient.invalidateQueries(["get-my-resources"]),
  });

  return (
    <>
      {(isLoading || destroyingResource) && (
        <p>Loading items, please wait...</p>
      )}
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
                <Typography gutterBottom variant="h6" component="div">
                  {resource.resourceName}
                </Typography>
                <Typography gutterBottom variant="h7" component="div">
                  {resource.skuName} : {resource.status}
                </Typography>
              </CardContent>
              <CardActions
                style={{ display: "flex", flexDirection: "row-reverse" }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  style={{ margin: "1%" }}
                  onClick={() => destroy(resource.resourceId)}
                  disabled={resource.status === "DESTROYED"}
                >
                  Destroy
                </Button>
                <Button
                  size="small"
                  onClick={() => window.open("https://mui.com/", "_blank")}
                  style={{ margin: "1%" }}
                  disabled={resource.status === "DESTROYED"}
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
