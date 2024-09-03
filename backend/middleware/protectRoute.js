import jwt from "jsonwebtoken";
export const protectedRoute = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      if (!decode) {
          return res.status(401).json({error: "Unauthorized"})
      }
    req.userId = decode.userId;
    next();
  } catch (error) {
      console.log(error)
      return res.status(500).json({error: "Error in authentication"})
  }
};
