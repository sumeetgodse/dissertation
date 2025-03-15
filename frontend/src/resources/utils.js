import apiClient from "../axios";

export const destroyResource = async (resourceId) => {
  const response = await apiClient.put(`/api/resources/${resourceId}/destroy`);
  return response;
};
