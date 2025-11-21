import { Launch } from "types";
import { addFavorite, removeFavorite } from "api/favorites";
import { ReactComponent as Star } from "assets/images/star.svg";
import "./index.scss";

interface LaunchCardProps {
  launch: Launch;
  updateFavorite: Function;
}

export const LaunchCard = ({ launch, updateFavorite }: LaunchCardProps) => {
  const handleClickFavorite = async () => {
    const nextFavorite = !launch.favorite;
    try {
      await (launch.favorite
        ? removeFavorite(launch.flight_number)
        : addFavorite(launch.flight_number));
      updateFavorite(launch.flight_number, nextFavorite);
    } catch (error) {
      console.error("Unable to update favorite", error);
    }
  };

  return (
    <div className="launch-card">
      <div
        className="patch"
        style={{ backgroundImage: `url(${launch.mission_patch})` }}
      />
      <div className="content">
        <h3>{launch.mission_name}</h3>
        <span className="details">{launch.details}</span>
        <span className="date">
          {new Date(launch.launch_date_unix).toDateString()}
        </span>
        <Star
          onClick={handleClickFavorite}
          className={launch.favorite ? "active" : ""}
        />
      </div>
    </div>
  );
};
