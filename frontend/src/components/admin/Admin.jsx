import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import apiClient from "../../axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@mui/material";
import { destroyResource } from "../../resources/utils";

export const Admin = () => {
  const queryClient = useQueryClient();

  const {
    isLoading,
    isSuccess,
    data: resources,
  } = useQuery({
    queryFn: () => apiClient.get("/api/resources/all").then((res) => res.data),
    queryKey: ["get-all-resources"],
  });

  const { isLoading: destroyingResource, mutate: destroy } = useMutation({
    mutationFn: destroyResource,
    onSuccess: () => queryClient.invalidateQueries(["get-all-resources"]),
  });

  return (
    <TableContainer component={Paper} style={{ marginTop: "2%" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Resource Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Catalog Item</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Launch</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Destroy</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Owner</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(resources) &&
            resources?.map((resource) => (
              <TableRow
                key={resource.resourceId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {resource.resourceName}
                </TableCell>
                <TableCell>{resource.skuName}</TableCell>
                <TableCell>{resource.status}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => window.open("https://mui.com/", "_blank")}
                    disabled={resource.status === "DESTROYED"}
                  >
                    Launch
                  </Button>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>{resource.owner}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {(isLoading || destroyingResource) && <p>Please wait...</p>}
      {isSuccess && resources === "UNAUTHORIZED" && (
        <p>Sorry! You do not have access to this feature!</p>
      )}
    </TableContainer>
  );
};
