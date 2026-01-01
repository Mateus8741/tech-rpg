import { PrismaClient, UserRole } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Criar usuários de exemplo
  const master = await prisma.user.upsert({
    where: { username: "mestre" },
    update: {},
    create: {
      username: "mestre",
      role: UserRole.MASTER,
    },
  });

  const player1 = await prisma.user.upsert({
    where: { username: "jogador1" },
    update: {},
    create: {
      username: "jogador1",
      role: UserRole.PLAYER,
    },
  });

  const player2 = await prisma.user.upsert({
    where: { username: "jogador2" },
    update: {},
    create: {
      username: "jogador2",
      role: UserRole.PLAYER,
    },
  });

  console.log("✅ Usuários criados:");
  console.log(`   Mestre: ${master.username}`);
  console.log(`   Jogador 1: ${player1.username}`);
  console.log(`   Jogador 2: ${player2.username}`);

  // Criar personagens de exemplo
  const warrior = await prisma.character.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      userId: player1.id,
      name: "Thorin Ferro",
      race: "Anão",
      class: "Guerreiro",
      level: 5,
      background: "Soldado",
      alignment: "Leal e Bom",
      experience: 6500,
      strength: 16,
      dexterity: 12,
      constitution: 15,
      intelligence: 10,
      wisdom: 13,
      charisma: 8,
      strengthModifier: 3,
      dexterityModifier: 1,
      constitutionModifier: 2,
      intelligenceModifier: 0,
      wisdomModifier: 1,
      charismaModifier: -1,
      maxHitPoints: 45,
      currentHitPoints: 45,
      temporaryHitPoints: 0,
      armorClass: 18,
      skills: {
        athletics: true,
        intimidation: true,
        perception: true,
      },
      proficiencies: ["Armaduras", "Escudos", "Armas Simples", "Armas Marciais"],
      equipment: [
        "Espada Longa",
        "Escudo",
        "Armadura de Placas",
        "Machado de Guerra",
      ],
      spells: [],
      features: [
        "Ataque Extra",
        "Segundo Fôlego",
        "Estilo de Combate: Proteção",
      ],
      notes: "Um anão guerreiro experiente, sempre pronto para a batalha.",
      customData: {},
    },
  });

  const wizard = await prisma.character.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      userId: player2.id,
      name: "Elara Estrela",
      race: "Elfo",
      class: "Mago",
      level: 4,
      background: "Eremita",
      alignment: "Neutro e Bom",
      experience: 4500,
      strength: 8,
      dexterity: 14,
      constitution: 12,
      intelligence: 17,
      wisdom: 13,
      charisma: 10,
      strengthModifier: -1,
      dexterityModifier: 2,
      constitutionModifier: 1,
      intelligenceModifier: 3,
      wisdomModifier: 1,
      charismaModifier: 0,
      maxHitPoints: 24,
      currentHitPoints: 24,
      temporaryHitPoints: 0,
      armorClass: 12,
      skills: {
        arcana: true,
        investigation: true,
        history: true,
        medicine: true,
      },
      proficiencies: ["Armas Simples", "Bastões", "Dardos"],
      equipment: [
        "Cajado Arcano",
        "Livro de Magias",
        "Componentes Mágicos",
        "Poção de Cura",
      ],
      spells: [
        "Bola de Fogo",
        "Raio Mágico",
        "Escudo Mágico",
        "Detectar Magia",
        "Teletransporte",
      ],
      features: [
        "Recuperação Arcana",
        "Tradição Mágica: Evocação",
      ],
      notes: "Uma elfa maga estudiosa, sempre em busca de conhecimento arcano.",
      customData: {},
    },
  });

  const rogue = await prisma.character.upsert({
    where: { id: "00000000-0000-0000-0000-000000000003" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000003",
      userId: player1.id,
      name: "Sombra Veloz",
      race: "Halfling",
      class: "Ladino",
      level: 3,
      background: "Criminoso",
      alignment: "Caótico e Neutro",
      experience: 2700,
      strength: 10,
      dexterity: 16,
      constitution: 13,
      intelligence: 12,
      wisdom: 11,
      charisma: 14,
      strengthModifier: 0,
      dexterityModifier: 3,
      constitutionModifier: 1,
      intelligenceModifier: 1,
      wisdomModifier: 0,
      charismaModifier: 2,
      maxHitPoints: 21,
      currentHitPoints: 18,
      temporaryHitPoints: 0,
      armorClass: 15,
      skills: {
        acrobatics: true,
        deception: true,
        stealth: true,
        sleightOfHand: true,
        investigation: true,
        perception: true,
      },
      proficiencies: ["Armas Simples", "Armas de Disparo", "Armas Leves"],
      equipment: [
        "Adaga",
        "Arco Curto",
        "Armadura de Couro",
        "Kit de Ladrão",
        "Corda",
      ],
      spells: [],
      features: [
        "Ataque Furtivo",
        "Especialização em Perícias",
        "Esquiva Ágil",
      ],
      notes: "Um halfling ágil e astuto, especialista em infiltração e furtividade.",
      customData: {},
    },
  });

  console.log("✅ Personagens criados:");
  console.log(`   ${warrior.name} - ${warrior.race} ${warrior.class} (Nível ${warrior.level})`);
  console.log(`   ${wizard.name} - ${wizard.race} ${wizard.class} (Nível ${wizard.level})`);
  console.log(`   ${rogue.name} - ${rogue.race} ${rogue.class} (Nível ${rogue.level})`);

  console.log("\n🎉 Seed concluído!");
  console.log("\n📋 Usuários criados:");
  console.log("\n🎲 Mestre:");
  console.log("   Username: mestre");
  console.log("\n👤 Jogador 1:");
  console.log("   Username: jogador1");
  console.log("   Personagens: Thorin Ferro, Sombra Veloz");
  console.log("\n👤 Jogador 2:");
  console.log("   Username: jogador2");
  console.log("   Personagens: Elara Estrela");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

