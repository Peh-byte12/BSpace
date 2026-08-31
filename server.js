const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

const parceirosAutorizados = [
    "http://localhost:3000",
    "http://localhost:5173"
];

app.use(cors({
    origin: parceirosAutorizados,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

const passagens = [
    {
        id: 1,
        origem: "São Paulo",
        destino: "Rio de Janeiro",
        preco: 450
    },
    {
        id: 2,
        origem: "São Paulo",
        destino: "Salvador",
        preco: 780
    },
    {
        id: 3,
        origem: "São Paulo",
        destino: "Recife",
        preco: 920
    }
];

app.get("/passagens", (req, res) => {
    res.json(passagens);
});

app.post("/passagens", (req, res) => {
    const novaPassagem = {
        id: passagens.length + 1,
        origem: req.body.origem,
        destino: req.body.destino,
        preco: req.body.preco
    };

    passagens.push(novaPassagem);

    res.status(201).json(novaPassagem);
});

app.listen(5000, () => {
    console.log("Servidor rodando em http://localhost:5000");
});
