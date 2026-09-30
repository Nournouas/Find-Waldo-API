const express = require('express');
const { handleVerifyCoords, startGame, addScore, getScores } = require('../controllers/gameController');
const gameRouter = express.Router();

gameRouter.post("/verify", handleVerifyCoords);
gameRouter.post("/submit-score", addScore);
gameRouter.get("/get-scores", getScores);
gameRouter.get("/start", startGame);

module.exports = {
  gameRouter,
} 