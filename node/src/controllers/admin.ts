import jwt from "jsonwebtoken";

export const generateToken = async (req, res) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  const userId = req.body.userId;

  if (!jwtSecretKey) {
    res.status(400).send("JWT Secret not set");
  }

  if (!userId) {
    res.status(400).send("UserId not set");
  }

  const data = {
    time: Date(),
    userId
  };

  const ttl = process.env.JWT_EXPIRES_IN || "1h";
  const token = jwt.sign(data, jwtSecretKey, { expiresIn: ttl });

  res.send({ token });
};
