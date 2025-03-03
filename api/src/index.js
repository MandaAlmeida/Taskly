import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/users.js";
import cors from "cors";
import { config } from "dotenv";

config();

const app = express();
app.use(express.json());
app.use(cors());

const port = 3001;
const mongoURI = process.env.MONGO_URI;


mongoose.connect(mongoURI)
    .then(() => {
        app.listen(port, () => {
            console.log(`Conectado ao Banco de Dados!`);
        });
    })
    .catch((error) => {
        console.error("Erro ao conectar ao banco:", error);
    });

// Definição das rotas deve vir depois dos middlewares
app.use("/", userRoutes);
