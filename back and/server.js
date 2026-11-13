const express = require("express");
const cors = require("cors");

const usuarioRoutes = require("./routes/usuarioRoutes");
const motoristaRoutes = require("./routes/motoristaRoutes");
const corridaRoutes = require("./routes/corridaRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensagem: "API WN funcionando!"
    });
});

app.use("/usuarios", usuarioRoutes);
app.use("/motoristas", motoristaRoutes);
app.use("/corridas", corridaRoutes);
app.use("/auth", authRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});