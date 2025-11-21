import { addFavorite, removeFavorite, getFavorites } from "../favorites";

const insertMock = jest.fn();
const findMock = jest.fn();
const deleteMock = jest.fn();

jest.mock("../../database/app-data-source", () => ({
  AppDataSource: {
    getRepository: () => ({
      find: findMock,
      insert: insertMock,
      delete: deleteMock
    })
  }
}));

jest.mock("../../entities/favorites", () => ({
  Favorites: {}
}));

const createRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("favorites controllers", () => {
  beforeEach(() => {
    insertMock.mockReset();
    findMock.mockReset();
    deleteMock.mockReset();
  });

  it("adds favorite when not existing", async () => {
    findMock.mockResolvedValue([]);
    const req: any = {
      currentUserId: 1,
      params: { flight_number: "10" }
    };
    const res = createRes();

    await addFavorite(req, res);

    expect(findMock).toHaveBeenCalledWith({
      where: { flight_number: 10, user_id: 1 }
    });
    expect(insertMock).toHaveBeenCalledWith({
      flight_number: 10,
      user_id: 1
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("does not duplicate favorite if it exists", async () => {
    findMock.mockResolvedValue([{}]);
    const req: any = { currentUserId: 1, params: { flight_number: "5" } };
    const res = createRes();

    await addFavorite(req, res);

    expect(insertMock).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("returns 400 for invalid flight number on add", async () => {
    const req: any = { currentUserId: 1, params: { flight_number: "NaN" } };
    const res = createRes();

    await addFavorite(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("removes favorite for valid request", async () => {
    const req: any = { currentUserId: 2, params: { flight_number: "7" } };
    const res = createRes();

    await removeFavorite(req, res);

    expect(deleteMock).toHaveBeenCalledWith({
      flight_number: 7,
      user_id: 2
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 400 for invalid flight number on remove", async () => {
    const req: any = { currentUserId: 1, params: { flight_number: "abc" } };
    const res = createRes();

    await removeFavorite(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("gets favorites for current user", async () => {
    findMock.mockResolvedValue([{ flight_number: 1 }]);
    const req: any = { currentUserId: 3 };
    const res = createRes();

    await getFavorites(req, res);

    expect(findMock).toHaveBeenCalledWith({
      where: { user_id: 3 }
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ flight_number: 1 }]);
  });
});
