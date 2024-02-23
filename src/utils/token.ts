import jwt from "jsonwebtoken";
import Token from "./interfaces/token.interface";
import User from "resources/user/user.interface";

const createToken = (user: User): string => {
  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: "30d",
    },
  );

  return token;
};

const verifyToken = (token: string): Promise<Token | jwt.JsonWebTokenError> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (err, payload) => {
      if (err) return reject(err);

      resolve(payload as Token);
    });
  });
};

export default { createToken, verifyToken };
