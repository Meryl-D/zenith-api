import express from 'express';
import bcrypt from "bcrypt";
import User from "../models/user";
import jwt from "jsonwebtoken";
import authenticate from "./middleware/authMiddleware.js";

const secretKey = process.env.SECRET_KEY || "UqFj3LgP18YPI5Qc";

function authorize(req, res, next) {
    if (req.userId != req.body.userId) return res.status(403).send("Unauthorized")
    next()
}

const authRouter = express.Router();
/* GET Authentification */
authRouter.get('/login', function (req, res, next) {
    res.send('Login');
})

// login route
authRouter.post("/login", authenticate, function (req, res, next) {
    //search for user in database
    User.findOne({ name: req.body.name }).exec(function (err, user) {
        if (err) {
            return next(err);
        } else if (!user) {
            return res.sendStatus(401);
        }
        // compare password
        bcrypt.compare(req.body.password, user.password, function (err, valid) {
            if (err) {
                return next(err);
            } else if (!valid) {
                return res.sendStatus(401);
            }
            // Login is valid...
            res.send(`Welcome ${user.name}!`);

            // Generate a valid JWT which expires in 7 days.
            const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
            const payload = { sub: user._id.toString(), exp: exp };
            jwt.sign(payload, secretKey, function (err, token) {
                if (err) { return next(err); }
                res.send({ token: token }); // Send the token to the client.
            });
        });
    })
});
export default authRouter;
