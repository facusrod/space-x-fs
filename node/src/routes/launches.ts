import { auth } from "../middlewares/auth";
import { getLaunches } from "../controllers/launches";
import { addFavorite, removeFavorite } from "../controllers/favorites";

export default (router) => {
  router.get("/launches", auth, getLaunches);
  router.post("/launches/:flight_number/favorite", auth, addFavorite);
  router.delete("/launches/:flight_number/favorite", auth, removeFavorite);
};
