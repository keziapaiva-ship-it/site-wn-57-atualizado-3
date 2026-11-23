require('dotenv').config({ path: __dirname + '/.env' });

if (!process.env.JWT_SECRET) {
    console.error("ERRO: JWT_SECRET não definido no arquivo .env");
    process.exit(1);
}

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
