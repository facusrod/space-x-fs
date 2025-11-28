/* eslint-disable camelcase */
import { getUserFavorites } from "./favorites";

export const processLaunches = async (userId, launches, rockets) => {
  const userFavorites = await getUserFavorites(userId);
  const favoritesSet = new Set(
    userFavorites?.map(({ flight_number }) => flight_number) ?? []);

  const rocketsById = Array.isArray(rockets)
    ? rockets.reduce((acc, rocket) => {
        if (rocket?.rocket_id) {
          acc[rocket.rocket_id] = rocket;
        }
        return acc;
      }, {})
    : {};

  if (!Array.isArray(launches)) {
    return [];
  }

  return launches.map((launch) => {
    const launchRocketId = launch?.rocket?.rocket_id;
    const rocketDetails = rocketsById[launchRocketId] || launch?.rocket || {};

    return {
      flight_number: launch.flight_number,
      mission_name: launch.mission_name,
      mission_patch: launch.links?.mission_patch || "",
      details: launch.details,
      launch_date_unix: launch.launch_date_unix,
      rocket: {
        rocket_id: rocketDetails.rocket_id,
        rocket_name: rocketDetails.rocket_name,
        active: rocketDetails.active,
        cost_per_launch: rocketDetails.cost_per_launch,
        company: rocketDetails.company
      },
      favorite: favoritesSet.has(launch.flight_number)
    };
  });
};
