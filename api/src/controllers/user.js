// Importa o modelo User para interagir com o banco de dados
import { User } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Função privada para listar todos os usuários e filtrar 
export async function getUsersById(req, res) {
    const id = req.params.id
    const user = await User.findById(id, '-password')

    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json({ user })
}

// Função para registrar usuário
export async function registerUser(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    //validacao
    if (!name) {
        return res.status(422).json({ message: "O nome é obrigatório!" });
    }
    if (!email) {
        return res.status(422).json({ message: "O e-mail é obrigatório!" });
    }
    if (!password) {
        return res.status(422).json({ message: "A senha é obrigatória!" });
    }

    if (password !== confirmPassword) {
        return res.status(422).json({ message: "As senhas não conferem!" });
    }

    // Verifica se já existe um usuário com o mesmo e-mail
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.status(422).json({ error: "E-mail já está em uso" });
    }

    // criar senha
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt);

    // criando usuario 
    const user = new User({
        name,
        email,
        password: passwordHash,
    })

    try {
        await user.save()
        return res.status(201).json({ message: "Usuário criado com sucesso" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao salvar usuário" });
    }

}

// Função para fazer login na aplicacao 
export async function loginUser(req, res) {
    const { email, password } = req.body;

    if (!email) {
        return res.status(422).json({ message: "O e-mail é obrigatório!" });
    }
    if (!password) {
        return res.status(422).json({ message: "A senha é obrigatória!" });
    }

    //conferir se o usuario existe
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    //conferir se a senha esta correta
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
        return res.status(404).json({ message: "Senha inválida!" });
    }

    try {
        const secret = process.env.SECRET
        const token = jwt.sign(
            {
                id: user._id,
            },
            secret,
        )

        res.status(200).json({ message: "Autenticação realizada com sucesso", token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao fazer login" });
    }

}

// Função para atualizar os dados de um usuário existente
export async function updateUser(req, res) {
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
        return res.status(200).json({ message: "Dados de usuário atualizados com sucesso", user });
    } catch (error) {
        // Se ocorrer algum erro, exibe o erro no console e retorna um status 500 com a mensagem de erro
        console.error(error);
        return res.status(500).json({ error: "Erro ao editar dados do usuário" });
    }
}

// Função para excluir um usuário
export async function deleteUser(req, res) {
    try {
        // Deleta o usuário do banco de dados pelo ID fornecido na URL
        const user = await User.findByIdAndDelete(req.params.id);

        // Retorna uma resposta de sucesso confirmando a exclusão
        return res.status(200).json({ message: "Usuário deletado com sucesso", user });
    } catch (error) {
        // Se ocorrer algum erro, exibe o erro no console e retorna um status 500 com a mensagem de erro
        console.error(error);
        return res.status(500).json({ error: "Erro ao excluir usuário" });
    }
};
