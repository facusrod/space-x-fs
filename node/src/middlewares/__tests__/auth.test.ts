import jwt from "jsonwebtoken";
import { auth } from "../auth";

const createRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("auth middleware", () => {
  const secretBackup = process.env.JWT_SECRET_KEY;

  beforeEach(() => {
    process.env.JWT_SECRET_KEY = "testsecret";
  });

  afterEach(() => {
    process.env.JWT_SECRET_KEY = secretBackup;
    jest.clearAllMocks();
  });

  it("returns 401 when authorization header is missing", () => {
    const req: any = { headers: {} };
    const res = createRes();
    const next = jest.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 for invalid token", () => {
    const req: any = { headers: { authorization: "Bearer invalid" } };
    const res = createRes();
    const next = jest.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("sets currentUserId and calls next for valid token", () => {
    const token = jwt.sign({ userId: 42 }, process.env.JWT_SECRET_KEY as string);
    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const res = createRes();
    const next = jest.fn();

    auth(req, res, next);

    expect(req.currentUserId).toBe(42);
    expect(next).toHaveBeenCalled();
  });
});
