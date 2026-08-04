import api from "./api";

const flatService = {
  getFlats: () => api.get("/flats"),
  getBuildings: () => api.get("/buildings"),
  createFlat: (data) => api.post("/flats", data),
};

export default flatService;
