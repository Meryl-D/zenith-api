import User from "../../database/models/userModel.js"

const secretKey = process.env.SECRET_KEY || "UqFj3LgP18YPI5Qc";

function authenticate(req, res, next) {
  // Ensure the header is present.
  const authorization = req.get("Authorization");
  if (!authorization) {
    return res.status(401).send("Authorization header is missing");
  }
  // Check that the header has the correct format.
  const match = authorization.match(/^Bearer (.+)$/);
  if (!match) {
    return res.status(401).send("Authorization header is not a bearer token");
  }
  // Extract and verify the JWT.
  const token = match[1];
  jwt.verify(token, secretKey, function(err, payload) {
    if (err) {
      return res.status(401).send("Your token is invalid or has expired");
    } else {
      req.User._id = payload.sub;
      next(); // Pass the ID of the authenticated user to the next middleware.
    }
  });
}

export default authenticate;