import { fetchLaunches, fetchRockets } from "../services/spacex";
import { processLaunches } from "../services/launches";

export const getLaunches = async (req, res,) => {
  const userId = Number(req.currentUserId);
  const [launches, rockets] = await Promise.all([
    fetchLaunches(),
    fetchRockets()
  ]);
  const outputLaunches = await processLaunches(userId, launches, rockets);

  return res.status(200).json(outputLaunches);
};
