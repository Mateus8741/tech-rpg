import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, Smartphone, TriangleAlert, Globe, ExternalLink } from 'lucide-react';
import {
  APK_URL,
  IPA_URL,
  APK_SIZE,
  IPA_SIZE,
  SIDELOADLY_URL,
  ALTSTORE_URL,
} from '@/lib/downloads';
import { ContinueCta } from './ContinueCta';

export const metadata: Metadata = {
  title: 'Baixar o app',
  description: 'Baixe o app de Fichas RPG para Android ou iPhone, ou continue pelo navegador.',
};

function D20({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden>
      <path d="M32 4 56 18v28L32 60 8 46V18z" />
      <path d="M32 4 20 36h24zM8 18l12 18M56 18 44 36M20 36 32 60l12-24M8 46l12-10M56 46 44 36" />
    </svg>
  );
}

function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="mt-4 space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-body">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo/15 text-xs font-bold text-indigo-ink">
            {i + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function DownloadButton({ href, label, size }: { href: string; label: string; size: string }) {
  return (
    <a
      href={href}
      download
      className="bg-brand-gradient mt-5 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgb(99_102_241/0.7)] outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
    >
      <Download className="h-4 w-4" aria-hidden />
      {label}
      <span className="font-normal opacity-80">({size})</span>
    </a>
  );
}

const linkClass = 'font-medium text-indigo-ink underline underline-offset-2 hover:text-indigo-ink-soft';

export default function DownloadLanding() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas px-4 py-10 sm:py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="animate-drift absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-indigo/20 blur-[110px] motion-reduce:animate-none" />
        <div className="animate-drift absolute -right-24 top-1/3 h-[26rem] w-[26rem] rounded-full bg-violet/20 blur-[120px] [animation-delay:-6s] motion-reduce:animate-none" />
      </div>

      <main className="relative mx-auto w-full max-w-4xl">
        {/* Cabeçalho */}
        <header className="flex flex-col items-center text-center">
          <div className="animate-float relative mb-4 motion-reduce:animate-none">
            <div aria-hidden className="absolute inset-0 rounded-full bg-gold/30 blur-xl" />
            <D20 className="relative h-16 w-16 text-gold" />
          </div>
          <h1 className="font-display text-gold-gradient glow-text text-3xl font-bold sm:text-4xl">
            Sistema de Fichas RPG
          </h1>
          <p className="mt-3 max-w-xl text-base text-ink-muted">
            Leve suas fichas de D&amp;D no bolso. Baixe o app no seu celular ou, se preferir, use direto no navegador.
          </p>
        </header>

        {/* Entrar pelo navegador */}
        <section className="rune-border mt-8 flex flex-col items-center gap-4 p-5 sm:flex-row sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <Globe className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
            <div>
              <h2 className="font-semibold text-ink">Não quer instalar nada?</h2>
              <p className="text-sm text-ink-muted">Use o sistema direto pelo navegador, no celular ou no computador.</p>
            </div>
          </div>
          <ContinueCta />
        </section>

        {/* Downloads */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Android */}
          <section className="rune-border p-5 sm:p-6" aria-labelledby="android-title">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/15 text-success">
                <Smartphone className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 id="android-title" className="font-display text-lg font-bold text-ink">Android</h2>
                <p className="text-xs text-ink-muted">Instalação simples, direto no celular</p>
              </div>
            </div>
            <DownloadButton href={APK_URL} label="Baixar para Android" size={APK_SIZE} />
            <Steps
              items={[
                <>Toque no botão acima para baixar o arquivo <strong>FichasRPG.apk</strong>.</>,
                <>Abra o arquivo baixado. Se o celular avisar sobre <strong>&ldquo;instalar de fontes desconhecidas&rdquo;</strong>, toque em <strong>Configurações</strong> e ative <strong>Permitir desta fonte</strong>.</>,
                <>Volte e toque em <strong>Instalar</strong>. Se aparecer um aviso do Play Protect, escolha <strong>Instalar mesmo assim</strong>.</>,
                <>Pronto! Abra o app <strong>Fichas RPG</strong> e entre com seu nome.</>,
              ]}
            />
          </section>

          {/* iPhone */}
          <section className="rune-border p-5 sm:p-6" aria-labelledby="ios-title">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo/15 text-indigo-ink">
                <Smartphone className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 id="ios-title" className="font-display text-lg font-bold text-ink">iPhone</h2>
                <p className="text-xs text-ink-muted">Precisa de um computador para instalar</p>
              </div>
            </div>
            <DownloadButton href={IPA_URL} label="Baixar para iPhone" size={IPA_SIZE} />
            <Steps
              items={[
                <>No <strong>computador</strong>, instale o <a className={linkClass} href={SIDELOADLY_URL} target="_blank" rel="noopener noreferrer">Sideloadly<ExternalLink className="ml-0.5 inline h-3 w-3" aria-hidden /></a> (grátis, em sideloadly.io) e baixe o arquivo <strong>FichasRPG.ipa</strong> acima.</>,
                <>Conecte o iPhone ao computador com o cabo, desbloqueie a tela e toque em <strong>Confiar</strong>.</>,
                <>Abra o Sideloadly, arraste o arquivo <strong>.ipa</strong> para dentro dele, digite o <strong>seu Apple ID</strong> e clique em <strong>Start</strong>.</>,
                <>No iPhone, vá em <strong>Ajustes &gt; Privacidade e Segurança</strong>, role até o fim e ligue o <strong>Modo Desenvolvedor</strong> (o iPhone vai reiniciar).</>,
                <>Depois vá em <strong>Ajustes &gt; Geral &gt; VPN e Gerenciamento de Dispositivo</strong>, toque no seu Apple ID e em <strong>Confiar</strong>.</>,
                <>Abra o app <strong>Fichas RPG</strong> na tela inicial.</>,
              ]}
            />
            <div role="note" className="mt-5 flex gap-3 rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm text-ink-body">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" aria-hidden />
              <p>
                <strong>Atenção:</strong> com Apple ID gratuito, o app <strong>expira em 7 dias</strong>. Quando parar de abrir, é só repetir a instalação no Sideloadly. Para renovar sozinho pelo Wi-Fi, use o{' '}
                <a className={linkClass} href={ALTSTORE_URL} target="_blank" rel="noopener noreferrer">AltStore</a>.
              </p>
            </div>
          </section>
        </div>

        <p className="mt-8 text-center text-xs text-ink-faint">
          Dúvidas? Fale com quem te enviou este link. Já tem o app?{' '}
          <Link href="/entrar" className={linkClass}>Entrar com meu personagem</Link>
        </p>
      </main>
    </div>
  );
}
