import numpy as np, wave
SR = 44100; DUR = 38.4
n = int(SR * DUR); t = np.arange(n) / SR
rng = np.random.default_rng(7)
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def env(length, a, r):
    e = np.ones(length); na, nr = int(a*SR), int(r*SR)
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e
mix = np.zeros(n)
def add(sig, start):
    i = int(start * SR); j = min(n, i + len(sig))
    if i < n: mix[i:j] += sig[: j - i]

# pad: Am - F - C - G, 7.5s each
chords = [[45,57,60,64],[41,53,57,60],[48,55,60,64],[43,55,59,62]]
for k in range(5):
    st, L = k * 7.5, 8.5
    tt = np.arange(int(L*SR)) / SR; sig = np.zeros(len(tt))
    for m in chords[k % 4]:
        for det in (-0.004, 0.004):
            f = midi(m) * (1 + det)
            sig += np.sin(2*np.pi*f*tt) + 0.3*np.sin(2*np.pi*2*f*tt) + 0.1*np.sin(2*np.pi*3*f*tt)
    sig *= (0.8 + 0.2*np.sin(2*np.pi*0.3*tt)) * env(len(tt), 2.0, 2.0) * 0.045
    add(sig, st)

# arpeggio bells, 8th notes at 100bpm-ish
beat = 0.6
for k in range(5):
    ch = chords[k % 4]
    notes = [m + 12 for m in ch[1:]] + [ch[3] + 24]
    for b in range(12):
        st = k*7.5 + 1.0 + b*beat
        if st > 37: break
        m = notes[[0,1,2,3,2,1][b % 6]]
        L = 1.6; tt = np.arange(int(L*SR)) / SR
        f = midi(m)
        sig = (np.sin(2*np.pi*f*tt) + 0.4*np.sin(2*np.pi*2.76*f*tt)*np.exp(-6*tt)) * np.exp(-3.2*tt) * 0.07
        add(sig, st)

# soft drum thumps on scene starts
for st in [0, 5.83, 12.5, 19.0, 24.0, 28.0, 33.33]:
    L = 1.2; tt = np.arange(int(L*SR)) / SR
    f = 90 * np.exp(-4*tt) + 40
    sig = np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-4.5*tt) * 0.45
    add(sig, st)

# dice rattle 18.0 -> 20.0, then crit chime
for i in range(34):
    st = 24.0 + i * 0.058 + rng.random()*0.02
    L = 0.05; tt = np.arange(int(L*SR)) / SR
    click = rng.standard_normal(len(tt)) * np.exp(-90*tt) * (0.18 * (1 - i/45))
    add(click, st)
for m, d in [(81,0),(85,0.08),(88,0.16),(93,0.24)]:
    L = 2.5; tt = np.arange(int(L*SR)) / SR; f = midi(m)
    sig = (np.sin(2*np.pi*f*tt) + 0.35*np.sin(2*np.pi*2*f*tt)) * np.exp(-2.2*tt) * 0.12
    add(sig, 26.0 + d)

# outro swell + fade
mix *= np.minimum(1, (DUR - t) / 2.5) * np.minimum(1, t / 0.5)
mix = np.tanh(mix * 1.4) / 1.4
mix = mix / np.max(np.abs(mix)) * 0.8
# simple stereo spread via small delay
d = int(0.012 * SR); L_ = mix; R_ = np.concatenate([np.zeros(d), mix[:-d]])
st = (np.stack([L_, R_], 1) * 32767).astype(np.int16)
with wave.open("public/music.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
