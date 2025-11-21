import { useEffect, useContext, useState } from "react";
import { ModeContext } from "contexts/ModeContext";
import { Launch } from "types";
import { LaunchCard, Search, Pagination, CARDS_PER_PAGE } from "components";
import { getLaunches } from "../../api";
import "./index.scss";

export const LaunchesList = () => {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [filteredLaunches, setFilteredLaunches] = useState<Launch[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const { showAll } = useContext(ModeContext);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filterLaunches = () => {
    setCurrentPage(1);
    // 3
    const normalizedSearch = searchText.trim().toLowerCase();
    const filtered = launches.filter((launch: Launch) => {
      const matchesFavorites = showAll || launch.favorite;
      const matchesSearch = normalizedSearch
        ? launch.mission_name
            ?.toLowerCase()
            .includes(normalizedSearch)
        : true;
      return matchesFavorites && matchesSearch;
    });

    return setFilteredLaunches(filtered);
  };

  const loadLaunches = async () => {
    try {
      const launches = await getLaunches();
      setLaunches(launches);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadLaunches();
  }, []);

  useEffect(filterLaunches, [searchText, showAll, launches]);
  
  const handleFavoriteUpdate = (flightNumber: number, favorite: boolean) => {
    setLaunches((prevLaunches) =>
      prevLaunches.map((launch) =>
        launch.flight_number === flightNumber
          ? { ...launch, favorite }
          : launch
      )
    );
  };

  return (
    <div className="launches-list-container">
      <Search value={searchText} onChange={setSearchText} />
      <div className="launches-list">
        {filteredLaunches
          .filter(
            (_: Launch, i: number) =>
              i >= CARDS_PER_PAGE * (currentPage - 1) &&
              i < CARDS_PER_PAGE * currentPage
          )
          .map((launch, i) => (
            <LaunchCard
              key={launch.flight_number}
              launch={launch}
              updateFavorite={handleFavoriteUpdate}
            />
          ))} 
      </div>
      <Pagination
        value={currentPage}
        onChange={setCurrentPage}
        itemsCount={filteredLaunches.length}
      />
    </div>
  );
};
