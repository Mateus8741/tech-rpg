import { type Request, type Response, Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

// GET - Listar personagens (do usuário ou todos se for mestre)
router.get("/", async (req: Request, res: Response) => {
	try {
		const { username } = req.query;

		if (!username || typeof username !== "string") {
			return res.status(400).json({ error: "Username é obrigatório" });
		}

		// Busca o usuário para verificar o role
		const user = await prisma.user.findUnique({
			where: { username },
		});

		if (!user) {
			return res.status(404).json({ error: "Usuário não encontrado" });
		}

		// Se for mestre, retorna todos os personagens
		if (user.role === "MASTER") {
			const characters = await prisma.character.findMany({
				include: {
					user: {
						select: {
							id: true,
							username: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});
			return res.json({ characters });
		}

		// Se for player, retorna apenas seus personagens
		const characters = await prisma.character.findMany({
			where: { userId: user.id },
			orderBy: {
				createdAt: "desc",
			},
		});

		return res.json({ characters });
	} catch (error) {
		console.error("Erro ao listar personagens:", error);
		return res.status(500).json({ error: "Erro ao listar personagens" });
	}
});

// POST - Criar novo personagem
router.post("/", async (req: Request, res: Response) => {
	try {
		const { username, ...characterData } = req.body;

		if (!username) {
			return res.status(400).json({ error: "Username é obrigatório" });
		}

		const user = await prisma.user.findUnique({
			where: { username },
		});

		if (!user) {
			return res.status(404).json({ error: "Usuário não encontrado" });
		}

		const character = await prisma.character.create({
			data: {
				userId: user.id,
				name: characterData.name || "Novo Personagem",
				race: characterData.race || "Humano",
				class: characterData.class || "Guerreiro",
				level: characterData.level || 1,
				background: characterData.background,
				alignment: characterData.alignment,
				experience: characterData.experience || 0,
				strength: characterData.strength || 10,
				dexterity: characterData.dexterity || 10,
				constitution: characterData.constitution || 10,
				intelligence: characterData.intelligence || 10,
				wisdom: characterData.wisdom || 10,
				charisma: characterData.charisma || 10,
				maxHitPoints: characterData.maxHitPoints || 8,
				currentHitPoints: characterData.currentHitPoints || 8,
				temporaryHitPoints: characterData.temporaryHitPoints || 0,
				maxMana: characterData.maxMana || 0,
				currentMana: characterData.currentMana || 0,
				armorClass: characterData.armorClass || 10,
				skills: characterData.skills || {},
				proficiencies: characterData.proficiencies || [],
				equipment: characterData.equipment || [],
				abilities: characterData.abilities || [],
				spells: characterData.spells || [],
				features: characterData.features || [],
				notes: characterData.notes || "",
				customData: characterData.customData || {},
			},
		});

		return res.status(201).json({ character });
	} catch (error) {
		console.error("Erro ao criar personagem:", error);
		return res.status(500).json({ error: "Erro ao criar personagem" });
	}
});

// GET - Buscar personagem específico
router.get("/:id", async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { username } = req.query;

		if (!username || typeof username !== "string") {
			return res.status(400).json({ error: "Username é obrigatório" });
		}

		const user = await prisma.user.findUnique({
			where: { username },
		});

		if (!user) {
			return res.status(404).json({ error: "Usuário não encontrado" });
		}

		const character = await prisma.character.findUnique({
			where: { id },
			include: {
				user: {
					select: {
						id: true,
						username: true,
					},
				},
			},
		});

		if (!character) {
			return res.status(404).json({ error: "Personagem não encontrado" });
		}

		// Verifica permissão: mestre pode ver todos, player só os seus
		if (user.role !== "MASTER" && character.userId !== user.id) {
			return res.status(403).json({ error: "Acesso negado" });
		}

		return res.json({ character });
	} catch (error) {
		console.error("Erro ao buscar personagem:", error);
		return res.status(500).json({ error: "Erro ao buscar personagem" });
	}
});

// PUT - Atualizar personagem
router.put("/:id", async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { username, ...updateData } = req.body;

		if (!username) {
			return res.status(400).json({ error: "Username é obrigatório" });
		}

		const user = await prisma.user.findUnique({
			where: { username },
		});

		if (!user) {
			return res.status(404).json({ error: "Usuário não encontrado" });
		}

		// Verifica se o personagem existe e se o usuário tem permissão
		const existingCharacter = await prisma.character.findUnique({
			where: { id },
		});

		if (!existingCharacter) {
			return res.status(404).json({ error: "Personagem não encontrado" });
		}

		// Verifica permissão: mestre pode editar todos, player só os seus
		if (user.role !== "MASTER" && existingCharacter.userId !== user.id) {
			return res.status(403).json({ error: "Acesso negado" });
		}

		const character = await prisma.character.update({
			where: { id },
			data: updateData,
		});

		return res.json({ character });
	} catch (error) {
		console.error("Erro ao atualizar personagem:", error);
		return res.status(500).json({ error: "Erro ao atualizar personagem" });
	}
});

// DELETE - Deletar personagem
router.delete("/:id", async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { username } = req.query;

		if (!username || typeof username !== "string") {
			return res.status(400).json({ error: "Username é obrigatório" });
		}

		const user = await prisma.user.findUnique({
			where: { username },
		});

		if (!user) {
			return res.status(404).json({ error: "Usuário não encontrado" });
		}

		const existingCharacter = await prisma.character.findUnique({
			where: { id },
		});

		if (!existingCharacter) {
			return res.status(404).json({ error: "Personagem não encontrado" });
		}

		// Verifica permissão: mestre pode deletar todos, player só os seus
		if (user.role !== "MASTER" && existingCharacter.userId !== user.id) {
			return res.status(403).json({ error: "Acesso negado" });
		}

		await prisma.character.delete({
			where: { id },
		});

		return res.json({ message: "Personagem deletado com sucesso" });
	} catch (error) {
		console.error("Erro ao deletar personagem:", error);
		return res.status(500).json({ error: "Erro ao deletar personagem" });
	}
});

export default router;
