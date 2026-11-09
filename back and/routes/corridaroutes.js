const express = require("express");
const router = express.Router();

const corridaController = require("../controllers/corridaController");
const autenticar = require("../middlewares/authMiddleware");

router.post("/", autenticar, corridaController.criar);

router.get("/", autenticar, corridaController.listar);

module.exports = router;