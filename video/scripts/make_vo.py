"""Gera a narração pt-BR com Piper (voz neural local).
Uso: PIPER_PY=<python do venv> PIPER_MODEL=<faber.onnx> python3 scripts/make_vo.py"""
import os, subprocess
py, model = os.environ["PIPER_PY"], os.environ["PIPER_MODEL"]
lines = [
 "Conheça o Fichas RPG: a sua mesa de Dê e Dê, quinta edição, em português.",
 "Fichas completas, com atributos, modificadores e vida calculados automaticamente.",
 "Crie seu herói passo a passo: raça, classe, antecedente, atributos e magias.",
 "Compêndio, magias e regras da quinta edição, na palma da mão.",
 "E role os dados com emoção. Acerto crítico!",
 "O jogador cria as próprias fichas. O mestre enxerga a mesa inteira.",
 "Fichas RPG. Na web, no iOS e no Android.",
]
for i, t in enumerate(lines, 1):
    out = f"public/vo/v{i}.wav"
    subprocess.run([py, "-m", "piper", "-m", model, "--length-scale", "1.0", "-f", out], input=t.encode(), check=True)
    d = subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",out]).decode().strip()
    print(f"v{i}: {d}s")
