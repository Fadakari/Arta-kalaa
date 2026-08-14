import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";

export function getUserFromToken(req: NextApiRequest) {
  const token = req.cookies.token;
  if (!token) return null;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    return user;
  } catch {
    return null;
  }
}