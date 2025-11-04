const express = require("express");
const router = express.Router();

const {checkExamStatus} = require("../controllers/certifications.controller");
const { verifyToken } = require("../middleware/usersRequired.middleware"); 

router.post("/python", verifyToken, checkExamStatus);

module.exports = router;