"""Escolhe um ícone do pacote "Painterly Spell Icons" (J. W. Bjerk, CC BY 3.0) para cada carta.

Uso: python3 docs/card-art/map_painterly.py <pasta com os .png do pacote>
Gera:
  apps/web/public/cards/painterly/<ícone>.webp     (só os usados, 256px)
  apps/web/components/sheet/card-art-map.ts        (chave da carta -> arquivo)
Precisa do ImageMagick (`magick`).

A escolha é por regras: palavras no nome/descrição da magia definem o desenho; o elemento
(fogo, gelo...) ou a escola definem a cor; o círculo define o nível de poder (1-3).
"""
import os, re, subprocess, sys, unicodedata

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DATA = os.path.join(ROOT, 'packages/rules/src/data')
OUT_DIR = os.path.join(ROOT, 'apps/web/public/cards/painterly')
MAP_TS = os.path.join(ROOT, 'apps/web/components/sheet/card-art-map.ts')

def norm(s):
    return unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower()

SCHOOL_COLORS = {
    'Abjuração': ['blue', 'sky', 'royal'], 'Conjuração': ['orange', 'royal', 'red'],
    'Adivinhação': ['sky', 'blue', 'eerie'], 'Encantamento': ['magenta', 'jade', 'royal'],
    'Evocação': ['orange', 'red', 'blue'], 'Ilusão': ['magenta', 'royal', 'eerie'],
    'Necromancia': ['eerie', 'acid', 'red'], 'Transmutação': ['jade', 'acid', 'sky'],
}
ELEMENT_COLORS = [
    (r'fogo|chama|incend|queim|brasa|ardente|igneo|solar|sol\b', ['red', 'orange', 'fire']),
    (r'frio|gelo|neve|congel|glacial', ['blue', 'sky', 'ice']),
    (r'acid|veneno|venen|toxic', ['acid', 'jade']),
    (r'eletric|relamp|raio\b|trov', ['blue', 'sky', 'royal']),
    (r'necrot|morte|mortos|morto|drena', ['eerie', 'acid']),
    (r'radiante|sagrad|divin|luz\b', ['sky', 'royal', 'air']),
    (r'psiquic|mental|mente', ['magenta', 'royal']),
]

# (regex no nome, regex na descrição, desenho). A primeira que casar vence; nome pesa mais.
RULES = [
    (r'cura|curar|prece|palavra-de-poder-curar|regenera|vitalidade|elixir|ajuda$|auxilio|restaura', None, 'heal'),
    (r'ressurre|reviver|reencarna|poupar', None, 'light'),
    (r'misseis|flecha|adaga|saraivada|aljava|cordao|meteoro|espinhos$|agulha|rajada-de|chuva', None, 'fire-arrows'),
    (r'bola-de-fogo|esfera-flamejante|orbe|esfera', None, 'fireball'),
    (r'explos|onda|despedac|trovoada|estrond|lufada|catapulta|erupcao|destruicao|imolac|tempestade-de-fogo', None, 'explosion'),
    (r'relampago|eletric|chocante|convocar-relampagos|corrente-de-relampagos|raio-da-bruxa|tempestade', None, 'lightning'),
    (r'gelo|frio|neve|nevasca|congel|picada-congelante', None, 'ice'),
    (r'raio|dedo-da-morte|desintegrar|ataque-certeiro|rajada-mistica|rajada-prismatica', None, 'beam'),
    (r'nevoa|nuvem|escuridao|forma-gasosa|fome-de-hadar|neblina|fog|nublar', None, 'fog'),
    (r'agua|mare|tsunami|respirar|chuva|moldar-agua|controlar-agua', None, 'fog-water'),
    (r'vento|redemoinho|vendaval|diabo-da-poeira|clima|voo|levitac|queda-suave|andar-no-vento', None, 'wind'),
    (r'vinha|espinho|chicote|planta|arvore|laco|teia|constri|agarrao|abraco|enredar|crescer', None, 'vines'),
    (r'fruto|druida|natureza|seres-da-floresta|folha|pele-de-arvore|passo-entre-arvores|teleporte-por-plantas', None, 'leaf'),
    (r'terra|pedra|rocha|terremoto|tremor|moldar|ossos-da-terra|mover-terra|carne-para-pedra', None, 'rock'),
    (r'escudo|protec|armadura|santuario|vinculo-protetor|globo|muralha|barreira|cupula|resistencia|aura-de|ancora|tranca|alarme|simbolo|guarda|proteger|proibicao|isolamento|campo-antimagia', None, 'protect'),
    (r'lamina|arma|espada|punicao|golpe|selvageria|bordao|ataque', None, 'enchant'),
    (r'medo|horror|causar|assassino|pesadelo|maldic|rogar|bruxaria|perdicao|toque-macabro|toque-vampirico|contagio|doenca|praga|infestac|animar-os-mortos|criar-mortos|mortos|morte|necro|falar-com-mortos|pedagio', None, 'horror'),
    (r'velocidade|salto|passo|disparada|recuo|movimentacao|patas|andar|montaria|piscar|astucia|haste', None, 'haste'),
    (r'teleporte|porta|portal|plano|planar|semiplano|banimento|banir|projecao|forma-eterea|labirinto|aprisiona|encerrar|refugio|mansao|^arca', None, 'air-burst'),
    (r'mensag|telepat|elo|vinculo|idiomas|compreender|falar-com|enviar|boca|comunhao|contato|sonho|amizade|amigos|guia|bencao|heroismo|farol|aliado|ajudar', None, 'link'),
    (r'detectar|ver-o|visao|clarivid|observ|adivinh|augurio|identific|localizar|encontrar|lendas|olho|sexto|sentido|sentir|pensamentos|zona-da-verdade|olhar', None, 'evil-eye'),
    (r'enfeiti|encant|dominar|sugest|cativar|compuls|comando|riso|danca|coroa|marionete|acalmar|sono|confus|enfraquecer|modificar-memoria|missao|loquacidade|zombaria|sussurros|antipatia', None, 'evil-eye'),
    (r'ilus|imagem|invisib|disfarc|reflexos|miragem|terreno|similaridade|despistar|indetect|escrita|truque-de-corda|silencio|nublar|projetar|encarnacao', None, 'runes'),
    (r'metamorf|alterar|forma|animal|besta|selvag|aumentar|aprimorar|transform|despertar|inseto|wild|vinculo-com-a-besta', None, 'wild'),
    (r'luz|chama-sagrada|sagrad|solar|sol|divin|esplendor|radiante|farol', None, 'light'),
    (r'conjurar|convoca|encontrar-familiar|servo|cao-fiel|invocar|criar|fabricar|criacao|clone|simulacro|animar', None, 'runes'),
]
SCHOOL_DEFAULT = {
    'Abjuração': 'protect', 'Conjuração': 'runes', 'Adivinhação': 'evil-eye', 'Encantamento': 'evil-eye',
    'Evocação': 'explosion', 'Ilusão': 'runes', 'Necromancia': 'horror', 'Transmutação': 'wild',
}

# Ajustes manuais, revisados olhando as 444 magias: id -> "desenho-cor" (o nível vem do círculo).
SPELL_OVERRIDES = {
    'abraco-terrestre-de-maximilian': 'rock-plain',
    'absorver-elementos': 'shielding-fire',
    'acalmar-emocoes': 'heal-sky',
    'acesso-remoto': 'link-blue',
    'adivinhacao': 'evil-eye-eerie',
    'agarrao-da-terra': 'rock-plain',
    'amizade-animal': 'wild-jade',
    'ampliar-plantas': 'leaf-jade',
    'area-escorregadia': 'fog-orange',
    'armadura-de-agathys': 'ice-blue',
    'arrombar': 'air-burst-air',
    'astucia-selvagem': 'wild-orange',
    'ataque-certeiro': 'evil-eye-red',
    'ataque-do-zefiro': 'wind-sky',
    'aura-de-vida': 'heal-jade',
    'banquete-de-herois': 'leaf-orange',
    'barreira-de-laminas': 'slice-spirit',
    'bencao': 'light-royal',
    'bracos-de-hadar': 'horror-eerie',
    'cao-fiel-de-mordenkainen': 'wild-orange',
    'caos-na-fiacao': 'lightning-magenta',
    'catapulta': 'rock-plain',
    'cerimonia': 'light-sky',
    'chama-continua': 'light-air-fire',
    'chama-sagrada': 'light-air-fire',
    'chicote-de-espinhos': 'vines-jade',
    'chuva-de-bolas-de-neve-de-snilloc': 'ice-sky',
    'chuva-de-meteoros': 'fire-arrows',
    'compreender-idiomas': 'runes-blue',
    'comunhao': 'light-sky',
    'conjurar-animais': 'wild-orange',
    'conjurar-barlgura': 'horror-red',
    'conjurar-celestial': 'light-sky',
    'conjurar-demonio-das-sombras': 'horror-eerie',
    'conjurar-demonio-menor': 'horror-red',
    'conjurar-feerico': 'light-magenta',
    'conjurar-hezrou': 'horror-acid',
    'conjurar-rajada': 'fire-arrows-royal',
    'conjurar-vrock': 'horror-red',
    'consertar': 'runes-blue',
    'constricao': 'wind-grasp-magenta',
    'contingencia': 'runes-royal',
    'contramagica': 'runes-blue',
    'controlar-agua': 'fog-water-air',
    'controlar-chamas': 'explosion-orange',
    'controlar-o-clima': 'wind-blue',
    'coroa-da-loucura': 'horror-red',
    'crescer-espinhos': 'vines-acid',
    'criar-chamas': 'fireball-red',
    'criar-comida-e-agua': 'leaf-orange',
    'criar-fogueira': 'explosion-red',
    'criar-passagem': 'air-burst-air',
    'dedo-da-morte': 'horror-eerie',
    'desejo': 'light-magenta',
    'desintegrar': 'beam-jade',
    'despertar': 'leaf-jade',
    'despertar-subito': 'light-blue',
    'detectar-veneno-e-doenca': 'evil-eye-eerie',
    'dissipar-magia': 'runes-royal',
    'encarnacao-fantasmagorica': 'horror-eerie',
    'encontrar-armadilhas': 'evil-eye-eerie',
    'encontrar-familiar': 'runes-orange',
    'encontrar-veiculo': 'haste-sky',
    'erupcao-de-terra': 'rock-orange',
    'escudo-de-fogo': 'shielding-fire',
    'esfera-congelante-de-otiluke': 'ice-sky',
    'esfera-resiliente-de-otiluke': 'shielding-spirit',
    'esfera-tempestuosa': 'lightning-blue',
    'espirro-acido': 'fireball-acid',
    'esquentar-metal': 'explosion-red',
    'evaporacao-de-abi-dalzim': 'fog-water-air',
    'falar-com-animais': 'wild-jade',
    'falar-com-plantas': 'leaf-jade',
    'fantasma-digital': 'link-eerie',
    'farol-de-esperanca': 'light-sky',
    'flecha-relampejante': 'lightning-blue',
    'flechas-flamejantes': 'fire-arrows',
    'fogo-das-fadas': 'light-magenta',
    'forca-fantasmagorica': 'horror-eerie',
    'forma-gasosa': 'fog-air',
    'globos-de-luz': 'light-sky',
    'guardiao-da-fe': 'light-royal',
    'guardioes-espirituais': 'light-sky',
    'hacker-arcano': 'runes-blue',
    'heroismo': 'haste-fire',
    'idiomas': 'runes-blue',
    'imobilizar-monstro': 'wind-grasp-magenta',
    'imobilizar-pessoa': 'wind-grasp-magenta',
    'inseto-gigante': 'wild-eerie',
    'invadir-o-sistema': 'runes-blue',
    'lamina-da-chama-esverdeada': 'enchant-acid',
    'lamina-estrondosa': 'enchant-blue',
    'lentidao': 'fog-blue',
    'leque-cromatico': 'explosion-magenta',
    'liga-desliga': 'light-blue',
    'localizar-animais-ou-plantas': 'leaf-jade',
    'lufada': 'wind-sky',
    'lufada-de-vento': 'wind-blue',
    'manto-de-chamas': 'shielding-fire',
    'manto-do-cruzado': 'protect-orange',
    'mao-de-bigby': 'wind-grasp-sky',
    'mao-guiadora': 'beam-sky',
    'maos-magicas': 'wind-grasp-sky',
    'marca-do-cacador': 'evil-eye-red',
    'maremoto': 'wind-blue',
    'meteoros-momentaneos-de-melf': 'fire-arrows',
    'muralha-de-areia': 'rock-orange',
    'muralha-de-espinhos': 'vines-acid',
    'muralha-de-fogo': 'shielding-fire',
    'nevoa-fetida': 'fog-acid',
    'nevoa-mortal': 'fog-acid',
    'padrao-hipnotico': 'explosion-magenta',
    'palavra-de-poder-matar': 'horror-red',
    'palavra-de-recordacao': 'air-burst-sky',
    'parar-o-tempo': 'haste-royal',
    'passo-das-brumas': 'fog-air',
    'passo-entre-arvores': 'leaf-jade',
    'patas-de-aranha': 'wild-eerie',
    'pele-rochosa': 'rock-plain',
    'pequeno-refugio-de-leomund': 'shielding-spirit',
    'pirotecnia': 'explosion-orange',
    'piscar': 'air-burst-magenta',
    'poupar-os-mortos': 'heal-sky',
    'praga-de-insetos': 'horror-acid',
    'prestidigitacao': 'explosion-magenta',
    'prisao-de-energia': 'shielding-spirit',
    'purificar-comida-e-bebida': 'light-jade',
    'raio-de-fogo': 'fireball-red',
    'raio-de-gelo': 'beam-blue',
    'raio-do-enfraquecimento': 'beam-eerie',
    'rajada-de-veneno': 'fog-acid',
    'rajada-mistica': 'beam-magenta',
    'rajada-prismatica': 'beam-magenta',
    'relampago': 'lightning-blue',
    'remover-maldicao': 'light-jade',
    'repouso-tranquilo': 'light-royal',
    'reverter-a-gravidade': 'air-burst-air',
    'selvageria-primal': 'wild-acid',
    'sentido-bestial': 'wild-orange',
    'servo-invisivel': 'wind-grasp-air',
    'simbolo': 'runes-orange',
    'simbolo-de-protecao': 'runes-orange',
    'simulacro': 'ice-sky',
    'sonho': 'fog-magenta',
    'sono': 'fog-magenta',
    'taumaturgia': 'light-royal',
    'telecinesia': 'wind-grasp-sky',
    'teleporte-por-plantas': 'leaf-jade',
    'tempestade-de-gelo': 'ice-blue',
    'tentaculos-negros-de-evard': 'horror-eerie',
    'transmissao-infalivel': 'link-royal',
    'tsunami': 'wind-blue',
    'velocidade': 'haste-sky',
    'vento-protetor': 'wind-sky',
}

ACTIONS = {
    'atacar': 'slice-spirit-3', 'conjurar': 'runes-blue-3', 'disparada': 'haste-sky-3',
    'desengajar': 'wind-grasp-air-3', 'esquivar': 'wind-sky-2', 'ajudar': 'link-spirit-3',
    'esconder': 'fog-air-3', 'preparar': 'runes-royal-2', 'procurar': 'evil-eye-eerie-2',
    'empurrar': 'air-burst-air-3', 'duas-armas': 'slice-orange-3', 'ataque-de-oportunidade': 'slice-sky-3',
    'reacao-preparada': 'lighting-sky-2',
    # características (slug do nome)
    'furia': 'explosion-red-3', 'arma-de-sopro': 'fireball-red-3', 'acao-ardilosa': 'haste-royal-2',
    'forma-selvagem': 'wild-jade-3', 'segundo-folego': 'heal-jade-2', 'surto-de-acao': 'haste-fire-3',
    'inspiracao-de-bardo': 'light-magenta-2', 'imposicao-das-maos': 'heal-royal-3',
}

def variants(src):
    """'heal' -> {'jade': {1,2,3}, ...}; desenhos sem cor ficam com cor ''."""
    v = {}
    for f in os.listdir(src):
        m = re.match(r'^(.+)-([123])\.png$', f)
        if not m or f.startswith('frame-'):
            continue
        name, lvl = m.group(1), int(m.group(2))
        v.setdefault(name, set()).add(lvl)
    return v

def pick(v, design, colors, level):
    """Melhor arquivo de um desenho, tentando as cores em ordem."""
    opts = sorted(n for n in v if n == design or (n.startswith(design + '-') and '-' not in n[len(design) + 1:]))
    if not opts:
        return None
    for c in colors:
        if f'{design}-{c}' in opts:
            name = f'{design}-{c}'
            break
    else:
        name = opts[0]
    lvls = sorted(v[name])
    lvl = min(lvls, key=lambda l: abs(l - level))
    return f'{name}-{lvl}'

def spells():
    out = []
    for f in ('spells-a.ts', 'spells-b.ts'):
        src = open(os.path.join(DATA, f), encoding='utf8').read()
        for m in re.finditer(r'id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*level:\s*(\d+),\s*school:\s*"([^"]+)"', src):
            d = re.search(r'description:\s*"((?:[^"\\]|\\.)*)"', src[m.end():m.end() + 6000])
            out.append((m.group(1), m.group(2), int(m.group(3)), m.group(4), d.group(1) if d else ''))
    return out

def main():
    src = sys.argv[1]
    v = variants(src)
    mapping = {}
    for key, icon in ACTIONS.items():
        mapping[key] = icon
    for sid, name, level, school, desc in spells():
        text = norm(name + ' ' + desc[:300])
        colors = []
        for rx, cs in ELEMENT_COLORS:
            if re.search(rx, text):
                colors = cs
                break
        colors = colors + SCHOOL_COLORS.get(school, [])
        design = next((d for rx, _, d in RULES if re.search(rx, sid)), None) or SCHOOL_DEFAULT.get(school, 'runes')
        power = 1 if level <= 1 else 2 if level <= 4 else 3
        if sid in SPELL_OVERRIDES:
            o = SPELL_OVERRIDES[sid]
            # "fire-arrows" é um desenho sem cor; "fire-arrows-jade" é desenho + cor.
            design, colors = (o, []) if o in v else (o.rsplit('-', 1)[0], [o.rsplit('-', 1)[1]])
        icon = pick(v, design, colors, power) or pick(v, SCHOOL_DEFAULT.get(school, 'runes'), colors, power)
        mapping[sid] = icon
    os.makedirs(OUT_DIR, exist_ok=True)
    used = sorted(set(mapping.values()))
    for icon in used:
        dst = os.path.join(OUT_DIR, icon + '.webp')
        if not os.path.exists(dst):
            subprocess.run(['magick', os.path.join(src, icon + '.png'), '-quality', '82', dst], check=True)
    with open(MAP_TS, 'w', encoding='utf8') as fh:
        fh.write('// Gerado por docs/card-art/map_painterly.py; não edite à mão.\n')
        fh.write('// Ícones: "Painterly Spell Icons" de J. W. Bjerk (eleazzaar), CC BY 3.0, opengameart.org.\n\n')
        fh.write('/** Chave da carta (id da magia, id da ação ou slug do nome) -> arquivo em /cards/painterly. */\n')
        fh.write('export const CARD_ART: Record<string, string> = {\n')
        for k in sorted(mapping):
            fh.write(f"  '{k}': '{mapping[k]}',\n")
        fh.write('};\n')
    print(f'{len(mapping)} cartas, {len(used)} ícones distintos')

if __name__ == '__main__':
    main()
