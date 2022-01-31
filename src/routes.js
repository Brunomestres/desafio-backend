const express = require("express");
const router = express.Router();
const punterController = require("./controllers/punterController");

router.post("/apostador", punterController.createPunter);
router.post("/sorteio", punterController.createRaffle);
router.post("/sorteio/login", punterController.raffleLogin);
router.post("/sortear", punterController.draw);

module.exports = { router };
