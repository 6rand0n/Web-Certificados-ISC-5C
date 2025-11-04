const express = require("express");
const router = express.Router();

const { generateCertificate } = require("../controllers/pdf.controller");
const { verifyToken } = require("../middleware/usersRequired.middleware"); 

router.get("/:attemptId/certificate", verifyToken, generateCertificate); 

module.exports = router;