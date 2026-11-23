
const express = require("express");
const cors = require("cors");

const db = require("./database");

const usuarioRoutes = require("./routes/usuarioroutes");
const motoristaRoutes = require("./routes/motoristaroutes");
const corridaRoutes = require("./routes/corridaroutes");
const authRoutes = require("./routes/authroutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensagem: "API WN funcionando!"
    });
});

// Testar conexão com PostgreSQL
app.get("/teste-banco", async (req, res) => {
    try {
        const resultado = await db.query(
            "SELECT current_database() AS banco"
        );

        res.json({
            mensagem: "PostgreSQL conectado!",
            banco: resultado.rows[0].banco
        });

    } catch (erro) {
        console.error("Erro:", erro);

        res.status(500).json({
            mensagem: "Erro ao conectar ao banco de dados."
        });
    }
});

// Rotas existentes
app.use("/usuarios", usuarioRoutes);
app.use("/motoristas", motoristaRoutes);
app.use("/corridas", corridaRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
