import express from 'express';

function checkAuthorization(req, res, next) {
    if (req.userId != req.body.userId) return res.status(403).send("Unauthorized")
    next()
}

const authRouter = express.Router();
/* GET Authentification */
authRouter.get('/login', function(req, res, next) {
    res.send('Login');
})
export default authRouter;