import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  if (!jwtSecretKey) {
    return res.status(500).send("JWT Secret not set");
  }

  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, jwtSecretKey) as { userId?: number };
    if (!decoded?.userId) {
      return res.status(401).send("Unauthorized");
    }
    req.currentUserId = decoded.userId;
    return next();
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
};
