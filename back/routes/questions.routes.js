const express = require("express");
    const router = express.Router();
    const {startQuiz, submitAnswers} = require("../controllers/questions.controller");
    const {verifyToken} = require("../middleware/usersRequired.middleware");

    //POST que envia preguntas
    router.post("/start", verifyToken ,startQuiz);

    //POST que recibe y evalúa respuestas
    router.post("/submit", verifyToken ,submitAnswers);

    module.exports = router; // esto por default