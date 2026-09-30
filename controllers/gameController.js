const { answers1 } = require("../Utility/answer");
const { Pool } = require("pg");
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

const handleVerifyCoords = (req, res) => {
  const clickX = req.body.x;
  const clickY = req.body.y;
  const imageWidth = req.body.imageX;
  const imageHeight = req.body.imageY;
  const character = req.body.character;
  const foundX = req.body.foundX;
  const foundY = req.body.foundY;

  const clickXPrcnt = (clickX / imageWidth) * 100;
  const clickYPrcnt = (clickY / imageHeight) * 100;

  for (let [key, value] of Object.entries(answers1)){
    if (Math.abs(clickXPrcnt - value.x) < 0.8 && Math.abs(clickYPrcnt - value.y) < 2.5 && character === value.success){
      if (!req.session.correct) req.session.correct = [];
      req.session.correct.push({name: character, foundX: foundX, foundY: foundY});
      if (req.session.correct.length === 4) {
        const elapsed = Date.now() - req.session.startTime;
        req.session.correct = null;
        req.session.startTime = null;
        req.session.score = elapsed;
        
        res.json({ score: true, time: elapsed });
        return;
      }else{
        res.json({
          score: true,
        }); 
      }
      return;
    }
  }
  res.json({
        score: false,
      }); 
}

const startGame = (req, res) => {
  if (!req.session.startTime) {
    req.session.startTime = Date.now();
  }
  console.log(req.session)
  if (req.session.correct){
    res.json(req.session.correct);
  }else{
    res.json(false);
  }
}

const addScore = async (req, res) => {
  const name = req.body.name
  const score = req.session.score
  await pool.query('INSERT INTO scores (name, score) VALUES ($1, $2)', [name, score]);
  res.json(true)
}

const getScores = async (req, res) => {
  const score = await pool.query('SELECT * FROM scores ORDER BY score LIMIT 10');
  res.json(score)
}

module.exports = {
  handleVerifyCoords,
  startGame,
  addScore,
  getScores
}