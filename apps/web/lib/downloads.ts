// Links fixos da última release no GitHub: ao publicar uma versão nova, o site não precisa mudar.
// Para usar outro host, defina NEXT_PUBLIC_APK_URL / NEXT_PUBLIC_IPA_URL.
const RELEASES = 'https://github.com/Mateus8741/tech-rpg/releases/latest/download';
export const APK_URL = process.env.NEXT_PUBLIC_APK_URL || `${RELEASES}/FichasRPG.apk`;
export const IPA_URL = process.env.NEXT_PUBLIC_IPA_URL || `${RELEASES}/FichasRPG.ipa`;

export const APK_SIZE = '≈ 101 MB';
export const IPA_SIZE = '≈ 17 MB';

export const SIDELOADLY_URL = 'https://sideloadly.io';
export const ALTSTORE_URL = 'https://altstore.io';
