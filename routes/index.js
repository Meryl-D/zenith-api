import express from "express";
const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("Hello!");
});

export default router;
