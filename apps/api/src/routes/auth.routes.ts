import { type Request, type Response, Router } from "express";
import { prisma } from "../lib/prisma.js";

const router: Router = Router();

// POST - Criar ou buscar usuário
router.post("/", async (req: Request, res: Response) => {
	try {
		const { username, role } = req.body;

		if (!username || typeof username !== "string") {
			return res.status(400).json({ error: "Username é obrigatório" });
		}

		// Busca ou cria o usuário
		let user = await prisma.user.findUnique({
			where: { username },
		});

		if (!user) {
			user = await prisma.user.create({
				data: {
					username,
					role: role === "MASTER" ? "MASTER" : "PLAYER",
				},
			});
		}

		return res.json({ user });
	} catch (error) {
		console.error("Erro na autenticação:", error);
		return res.status(500).json({ error: "Erro ao autenticar usuário" });
	}
});

// GET - Buscar usuário por username
router.get("/", async (req: Request, res: Response) => {
	try {
		const { username } = req.query;

		if (!username || typeof username !== "string") {
			return res.status(400).json({ error: "Username é obrigatório" });
		}

		const user = await prisma.user.findUnique({
			where: { username },
			include: {
				characters: true,
			},
		});

		if (!user) {
			return res.status(404).json({ error: "Usuário não encontrado" });
		}

		return res.json({ user });
	} catch (error) {
		console.error("Erro ao buscar usuário:", error);
		return res.status(500).json({ error: "Erro ao buscar usuário" });
	}
});

export default router;
