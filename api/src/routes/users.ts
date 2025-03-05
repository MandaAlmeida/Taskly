import { Request, Response, NextFunction, Router, RequestHandler } from "express";
import { getUsersById, deleteUser, updateUser, registerUser, loginUser, createTask, getTask } from "../controllers/user.js";
import jwt from "jsonwebtoken";

const router = Router();


// Middleware para verificar token JWT
const checkToken: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader: string | undefined = req.headers["authorization"];
    const token: string | undefined = authHeader && authHeader.split(" ")[1];

    console.log(authHeader)

    if (!token) {
        res.status(401).json({ message: "Acesso negado" });
        return;
    }

    try {
        const secret = process.env.SECRET!
        const tokem = jwt.verify(token, secret)
        console.log(tokem)
        next()
    } catch (error) {
        res.status(400).json({ message: "Token inválido!" });
        return;
    }
};


// Definição das rotas com verificação de token onde necessário
router.get("/user/:id", checkToken, getUsersById);

router.post("/auth/register", registerUser);

router.post("/auth/login", loginUser);

router.put("/user/:id", checkToken, updateUser);

router.delete("/user/:id", checkToken, deleteUser);

router.post("/task", checkToken, createTask);
// Backend - Exemplo de rota para buscar tarefas do usuário
router.get('/tasks/:id', checkToken, getTask);




export default router;
