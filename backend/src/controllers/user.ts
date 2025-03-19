// Importa o modelo User para interagir com o banco de dados
import { Category, Task, User } from "../db.js";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

// Função para listar o usuário
export async function getUsersById(req: Request, res: Response): Promise<void> {
    const id = req.params.id
    const user = await User.findById(id, '-password')

    if (!user) {
        res.status(404).json({ message: "Usuário não encontrado" });
        return;
    }

    res.status(200).json({ user })
}

// Função para registrar usuário
export async function registerUser(req: Request, res: Response): Promise<void> {
    const { name, email, password, confirmPassword } = req.body;

    //validacao
    if (!name) {
        res.status(422).json({ message: "O nome é obrigatório!" });
        return;
    }
    if (!email) {
        res.status(422).json({ message: "O e-mail é obrigatório!" });
        return;
    }
    if (!password) {
        res.status(422).json({ message: "A senha é obrigatória!" });
        return;
    }

    if (password !== confirmPassword) {
        res.status(422).json({ message: "As senhas não conferem!" });
        return;
    }

    // Verifica se já existe um usuário com o mesmo e-mail
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        res.status(422).json({ error: "E-mail já está em uso" });
        return;
    }

    // criar senha
    const salt = await bcrypt.genSalt(8)
    const passwordHash = await bcrypt.hash(password, salt);

    // criando usuario 
    const user = new User({
        name,
        email,
        password: passwordHash,
    })

    try {
        await user.save();
        await createDefaultCategories(user._id);
        res.status(201).json({ message: "Usuário criado com sucesso" });
        return;

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao salvar usuário" });
        return;
    }

}

// Função para fazer login na aplicacao 
export async function loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email) {
        res.status(422).json({ message: "O e-mail é obrigatório!" });
        return;
    }
    if (!password) {
        res.status(422).json({ message: "A senha é obrigatória!" });
        return;
    }

    //conferir se o usuario existe
    const user = await User.findOne({ email: email });
    if (!user) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
    }

    //conferir se a senha esta correta
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
        res.status(404).json({ message: "Senha inválida!" });
        return;
    }

    try {
        const secret: string = process.env.SECRET!;
        const token = jwt.sign(
            {
                id: user._id,
            },
            secret,
        )

        res.status(200).json({ message: "Autenticação realizada com sucesso", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao fazer login" });
        return;
    }

}

// Função para atualizar os dados de um usuário existente
export async function updateUser(req: Request, res: Response): Promise<void> {
    try {
        // Extrai os dados do corpo da requisição
        const { name, email } = req.body;

        // Cria um objeto com os dados a serem atualizados
        const userBody = {
            name,
            email,
        };

        // Atualiza o usuário no banco de dados pelo ID fornecido na URL
        const user = await User.findByIdAndUpdate(req.params.id, userBody, { new: true });

        // Retorna uma resposta de sucesso com os dados atualizados do usuário
        res.status(200).json({ message: "Dados de usuário atualizados com sucesso", user });
        return;
    } catch (error) {
        // Se ocorrer algum erro, exibe o erro no console e retorna um status 500 com a mensagem de erro
        console.error(error);
        res.status(500).json({ error: "Erro ao editar dados do usuário" });
        return;
    }
}

// Função para excluir um usuário
export async function deleteUser(req: Request, res: Response): Promise<void> {
    try {
        // Deleta o usuário do banco de dados pelo ID fornecido na URL
        const user = await User.findByIdAndDelete(req.params.id);

        // Retorna uma resposta de sucesso confirmando a exclusão
        res.status(200).json({ message: "Usuário deletado com sucesso", user });
        return;
    } catch (error) {
        // Se ocorrer algum erro, exibe o erro no console e retorna um status 500 com a mensagem de erro
        console.error(error);
        res.status(500).json({ error: "Erro ao excluir usuário" });
        return;
    }
};

// Função para criar uma tarefa
export async function createTask(req: Request, res: Response): Promise<void> {
    const { name, category, priority, date, active } = req.body;

    // Captura o token do cabeçalho
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Acesso negado!" });
        return;
    }

    try {
        // Verifica o token e obtém o ID do usuário
        const secret = process.env.SECRET as string;
        const decoded = jwt.verify(token, secret) as { id: string };
        const userId = decoded.id;

        // Validação dos campos obrigatórios
        if (!name) {
            res.status(422).json({ message: "O nome é obrigatório!" });
            return;
        }
        if (!category) {
            res.status(422).json({ message: "A categoria é obrigatória!" });
            return;
        }
        if (!priority) {
            res.status(422).json({ message: "A prioridade é obrigatória!" });
            return;
        }
        if (!date) {
            res.status(422).json({ message: "A data é obrigatória!" });
            return;
        }

        // Verifica se já existe uma task com o mesmo nome, categoria e data para este usuário
        const existingTask = await Task.findOne({ name, category, date, userId });

        if (existingTask) {
            res.status(422).json({ error: "Essa task já existe para este usuário" });
            return;
        }

        // Criando task e vinculando ao usuário autenticado
        const task = new Task({
            name,
            category,
            priority,
            date,
            active,
            userId, // Vincula a tarefa ao usuário autenticado
        });

        await task.save();
        res.status(201).json({ message: "Tarefa criada com sucesso" });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao salvar tarefa" });
        return;
    }
};

// Função para ler uma tarefa
export async function getTask(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    try {
        const tasks = await Task.find({ userId: userId });

        // Se não houver tarefas, retorna um array vazio com status 200 (OK)
        res.status(200).json(tasks.length > 0 ? tasks : []);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar as tarefas", error });
    }
};

// Função para editar uma tarefa
export async function updateTask(req: Request, res: Response): Promise<void> {
    const { name, category, priority, date, active } = req.body;

    // Captura o token do cabeçalho
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Acesso negado!" });
        return;
    }

    try {

        const updateTask = await Task.findByIdAndUpdate(req.params.id,
            { name, category, priority, date, active },
            { new: true });

        // Retorna uma resposta de sucesso com os dados atualizados do usuário
        res.status(200).json({ message: "Dados da tarefa atualizado com sucesso", updateTask });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao salvar tarefa" });
        return;
    }
};

// Função para deletar uma tarefa
export async function deleteTask(req: Request, res: Response): Promise<void> {
    // Captura o token do cabeçalho
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Acesso negado!" });
        return;
    }

    try {
        const deleteTask = await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Tarefa excluida com sucesso", deleteTask });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao excluir a tarefa" });
        return;
    }
};

// Funcao cria as categorias padrao
async function createDefaultCategories(userId: Types.ObjectId) {
    const defaultCategories = ["Todas", "Pessoal", "Trabalho", "Estudo"];

    // Insere as categorias padrão no banco, vinculadas ao usuário recém-criado
    await Category.insertMany(
        defaultCategories.map((name) => ({
            name,
            userId,
        }))
    );
}

// Função para criar uma categoria
export async function createCategory(req: Request, res: Response): Promise<void> {
    const { name } = req.body;

    // Captura o token do cabeçalho
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Acesso negado!" });
        return;
    }

    try {
        // Verifica o token e obtém o ID do usuário
        const secret = process.env.SECRET as string;
        const decoded = jwt.verify(token, secret) as { id: string };
        const userId = decoded.id;

        // Validação dos campos obrigatórios
        if (!name) {
            res.status(422).json({ message: "A categoria é obrigatória!" });
            return;
        }

        // Verifica se já existe uma Category com o mesmo nome, categoria e data para este usuário
        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            res.status(422).json({ error: "Essa categoria já existe para este usuário" });
            return;
        }

        // Criando Category e vinculando ao usuário autenticado
        const category = new Category({
            name,
            userId, // Vincula a tarefa ao usuário autenticado
        });

        await category.save();
        res.status(201).json({ message: "Tarefa criada com sucesso" });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao salvar tarefa" });
        return;
    }
};

// Função para ler uma tarefa
export async function getCategory(req: Request, res: Response): Promise<void> {
    const userId = req.params.id; // Obtém o ID do usuário da URL

    // Captura o token do cabeçalho
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        console.error("Erro: token está ausente");
        res.status(401).json({ message: "Acesso negado! Token ausente." });
        return;
    }

    try {
        // Busca as categorias associadas ao userId
        const categories = await Category.find({ userId });

        if (!categories || categories.length === 0) {
            res.status(404).json({ message: "Nenhuma categoria encontrada para este usuário." });
            return;
        }

        res.status(200).json(categories);
    } catch (error) {
        console.error("Erro ao verificar token ou buscar categorias:", error);
        res.status(500).json({ message: "Erro ao buscar as categorias", error });
    }
}

// Função para editar uma tarefa
export async function updateCategory(req: Request, res: Response): Promise<void> {
    const { name } = req.body;

    // Captura o token do cabeçalho
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Acesso negado!" });
        return;
    }

    try {

        const updateCategory = await Category.findByIdAndUpdate(req.params.id,
            { name },
            { new: true });

        // Retorna uma resposta de sucesso com os dados atualizados do usuário
        res.status(200).json({ message: "Dados da tarefa atualizado com sucesso", updateCategory });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao salvar tarefa" });
        return;
    }
};

// Função para deletar uma tarefa
export async function deleteCategory(req: Request, res: Response): Promise<void> {
    // Captura o token do cabeçalho
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Acesso negado!" });
        return;
    }

    try {
        const deleteCategory = await Category.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Categoria excluida com sucesso", deleteCategory });
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao excluir a categoria" });
        return;
    }
};



