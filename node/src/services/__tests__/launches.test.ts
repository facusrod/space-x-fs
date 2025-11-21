import { processLaunches } from "../launches";
import { getUserFavorites } from "../favorites";

jest.mock("../favorites", () => ({
  getUserFavorites: jest.fn()
}));

const mockedGetUserFavorites = getUserFavorites as jest.Mock;

describe("processLaunches", () => {
  const launchesMock = [
    {
      flight_number: 1,
      mission_name: "DemoSat",
      launch_date_unix: 1174439400,
      details: "Test launch",
      rocket: { rocket_id: "falcon1" },
      links: { mission_patch: "patch1.png" }
    },
    {
      flight_number: 2,
      mission_name: "Trailblazer",
      launch_date_unix: 1217734440,
      details: "Another test",
      rocket: { rocket_id: "falcon9" },
      links: { mission_patch: "patch2.png" }
    }
  ];

  const rocketsMock = [
    {
      rocket_id: "falcon1",
      rocket_name: "Falcon 1",
      active: true,
      cost_per_launch: 6700000,
      company: "SpaceX"
    },
    {
      rocket_id: "falcon9",
      rocket_name: "Falcon 9",
      active: true,
      cost_per_launch: 50000000,
      company: "SpaceX"
    }
  ];

  beforeEach(() => {
    mockedGetUserFavorites.mockResolvedValue([{ flight_number: 2 }]);
  });

  it("merges launch and rocket data with favorites", async () => {
    const result = await processLaunches(1, launchesMock, rocketsMock);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      flight_number: 1,
      mission_name: "DemoSat",
      mission_patch: "patch1.png",
      details: "Test launch",
      rocket: rocketsMock[0],
      favorite: false
    });
    expect(result[1]).toMatchObject({
      flight_number: 2,
      rocket: rocketsMock[1],
      favorite: true
    });
  });

  it("handles missing rockets gracefully", async () => {
    const result = await processLaunches(1, launchesMock, undefined);
    expect(result[0].rocket.rocket_id).toBe("falcon1");
    expect(result[1].rocket.rocket_id).toBe("falcon9");
  });

  it("returns empty array for invalid launches input", async () => {
    const result = await processLaunches(1, null as unknown as any[], rocketsMock);
    expect(result).toEqual([]);
  });
});
