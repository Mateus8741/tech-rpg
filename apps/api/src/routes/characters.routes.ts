import { type Request, type Response, Router } from "express";
import { prisma } from "../lib/prisma.js";

const router: Router = Router();

const ABILITY_FIELDS = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"] as const;
const abilityMod = (score: number) => Math.floor((score - 10) / 2);

// Campos do modelo Character que o cliente pode alterar (whitelist).
const STRING_FIELDS = ["name", "race", "class", "background", "alignment", "notes"] as const;
const INT_FIELDS = [
	"level", "experience", ...ABILITY_FIELDS,
	"strengthModifier", "dexterityModifier", "constitutionModifier",
	"intelligenceModifier", "wisdomModifier", "charismaModifier",
	"maxHitPoints", "currentHitPoints", "temporaryHitPoints", "maxMana", "currentMana", "armorClass",
] as const;
const ARRAY_FIELDS = ["proficiencies", "equipment", "abilities", "inventory", "spells", "features"] as const;
const OBJECT_FIELDS = ["skills", "combatStatus", "customData"] as const;

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
	typeof v === "object" && v !== null && !Array.isArray(v);

/** Valida tipos e limites (nível 1-20, atributos 1-30). Retorna mensagem de erro ou null. */
function validateNumbers(d: Record<string, unknown>): string | null {
	for (const f of INT_FIELDS) {
		const v = d[f];
		if (v === undefined) continue;
		if (typeof v !== "number" || !Number.isInteger(v)) return `Campo ${f} deve ser um inteiro`;
	}
	const level = d.level;
	if (typeof level === "number" && (level < 1 || level > 20)) return "Nível deve estar entre 1 e 20";
	for (const f of ABILITY_FIELDS) {
		const v = d[f];
		if (typeof v === "number" && (v < 1 || v > 30)) return `Atributo ${f} deve estar entre 1 e 30`;
	}
	return null;
}

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

		const d = characterData as Record<string, unknown>;
		const validation = validateNumbers(d);
		if (validation) {
			return res.status(400).json({ error: validation });
		}

		const str = (v: unknown, fallback: string) => (typeof v === "string" && v.trim() ? v : fallback);
		const num = (v: unknown, fallback: number) => (typeof v === "number" ? v : fallback);
		const arr = (v: unknown) => (Array.isArray(v) ? v : []);
		const obj = (v: unknown) => (v && typeof v === "object" && !Array.isArray(v) ? v : {});

		const character = await prisma.character.create({
			data: {
				userId: user.id,
				name: str(d.name, "Novo Personagem"),
				race: str(d.race, "Humano"),
				class: str(d.class, "Guerreiro"),
				level: num(d.level, 1),
				background: typeof d.background === "string" ? d.background : undefined,
				alignment: typeof d.alignment === "string" ? d.alignment : undefined,
				experience: num(d.experience, 0),
				strength: num(d.strength, 10),
				dexterity: num(d.dexterity, 10),
				constitution: num(d.constitution, 10),
				intelligence: num(d.intelligence, 10),
				wisdom: num(d.wisdom, 10),
				charisma: num(d.charisma, 10),
				strengthModifier: num(d.strengthModifier, abilityMod(num(d.strength, 10))),
				dexterityModifier: num(d.dexterityModifier, abilityMod(num(d.dexterity, 10))),
				constitutionModifier: num(d.constitutionModifier, abilityMod(num(d.constitution, 10))),
				intelligenceModifier: num(d.intelligenceModifier, abilityMod(num(d.intelligence, 10))),
				wisdomModifier: num(d.wisdomModifier, abilityMod(num(d.wisdom, 10))),
				charismaModifier: num(d.charismaModifier, abilityMod(num(d.charisma, 10))),
				maxHitPoints: num(d.maxHitPoints, 8),
				currentHitPoints: num(d.currentHitPoints, num(d.maxHitPoints, 8)),
				temporaryHitPoints: num(d.temporaryHitPoints, 0),
				maxMana: num(d.maxMana, 0),
				currentMana: num(d.currentMana, 0),
				armorClass: num(d.armorClass, 10),
				skills: obj(d.skills),
				proficiencies: arr(d.proficiencies),
				equipment: arr(d.equipment),
				abilities: arr(d.abilities),
				inventory: arr(d.inventory),
				combatStatus: obj(d.combatStatus),
				spells: arr(d.spells),
				features: arr(d.features),
				notes: typeof d.notes === "string" ? d.notes : "",
				customData: obj(d.customData),
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

		const body = updateData as Record<string, unknown>;
		const validation = validateNumbers(body);
		if (validation) {
			return res.status(400).json({ error: validation });
		}

		// Whitelist: só campos conhecidos do modelo, com o tipo esperado
		const data: Record<string, unknown> = {};
		for (const f of STRING_FIELDS) {
			if (body[f] === undefined) continue;
			if (typeof body[f] !== "string") return res.status(400).json({ error: `Campo ${f} deve ser texto` });
			data[f] = body[f];
		}
		for (const f of INT_FIELDS) {
			if (body[f] !== undefined) data[f] = body[f];
		}
		for (const f of ARRAY_FIELDS) {
			if (body[f] === undefined) continue;
			if (!Array.isArray(body[f])) return res.status(400).json({ error: `Campo ${f} deve ser uma lista` });
			data[f] = body[f];
		}
		for (const f of OBJECT_FIELDS) {
			if (body[f] === undefined) continue;
			// combatStatus inválido vira objeto vazio (comportamento anterior); os demais são rejeitados
			if (!isPlainObject(body[f])) {
				if (f === "combatStatus") { data[f] = {}; continue; }
				return res.status(400).json({ error: `Campo ${f} deve ser um objeto` });
			}
			data[f] = body[f];
		}

		const character = await prisma.character.update({
			where: { id },
			data,
		});

		return res.json({ character });
	} catch (error) {
		console.error("Erro ao atualizar personagem:", error);
		const errorMessage = error instanceof Error ? error.message : "Erro ao atualizar personagem";
		return res.status(500).json({ error: errorMessage });
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
