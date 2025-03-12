import { Request, Response, NextFunction, Router, RequestHandler } from "express";
import { getUsersById, deleteUser, updateUser, registerUser, loginUser, createTask, getTask, updateTask, deleteTask, createCategory, getCategory, deleteCategory } from "../controllers/user.js";
import jwt from "jsonwebtoken";

const router = Router();


// Middleware para verificar token JWT
const checkToken: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader: string | undefined = req.headers["authorization"];
    const token: string | undefined = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Acesso negado" });
        return;
    }

    try {
        const secret = process.env.SECRET!
        const tokem = jwt.verify(token, secret)
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

router.get('/tasks/:id', checkToken, getTask);

router.put("/task/:id", checkToken, updateTask);

router.delete("/task/:id", checkToken, deleteTask);

router.post("/category", checkToken, createCategory);

router.get("/category/:id", checkToken, getCategory);

router.delete("/category/:id", checkToken, deleteCategory);



export default router;
