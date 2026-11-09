const express = require("express");
const router = express.Router();

const motoristaController = require("../controllers/motoristaController");

router.post("/", motoristaController.criar);

router.get("/", motoristaController.listar);

module.exports = router;