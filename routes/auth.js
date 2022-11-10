import express from 'express';

const authRouter = express.Router();
/* GET Authentification */
authRouter.get('/login', function(req, res, next) {
    res.send('Login');
});
export default authRouter;