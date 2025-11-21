import { getFavorites } from "../controllers/favorites";

export default (router) => {
  router.get("/favorites", getFavorites);
};
