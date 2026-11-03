import { PrismaClient, UserRole } from "@prisma/client";
import dotenv from "dotenv";
import { buildCharacters } from "./seed-data";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  const users = {} as Record<string, { id: string; username: string }>;
  for (const [username, role] of [
    ["mestre", UserRole.MASTER],
    ["jogador1", UserRole.PLAYER],
    ["jogador2", UserRole.PLAYER],
  ] as const) {
    users[username] = await prisma.user.upsert({ where: { username }, update: {}, create: { username, role } });
  }
  console.log(`Usuários: ${Object.keys(users).join(", ")}`);

  for (const c of buildCharacters()) {
    const owner = users[c.owner]!;
    // update refaz a ficha a partir das regras, mantendo ids fixos
    await prisma.character.upsert({
      where: { id: c.id },
      update: { ...c.data, userId: owner.id },
      create: { id: c.id, userId: owner.id, ...c.data },
    });
    console.log(`  ${c.data.name} - ${c.data.race} ${c.data.class} (Nível ${c.data.level}) -> ${c.owner}`);
  }

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
