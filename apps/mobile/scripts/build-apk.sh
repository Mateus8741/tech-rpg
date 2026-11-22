#!/usr/bin/env bash
# Gera o APK Android assinado com keystore próprio. Uso: pnpm build:apk
# Requer keystore/fichasrpg.jks e keystore/credentials.env (ignorados pelo git).
set -euo pipefail

cd "$(dirname "$0")/.."

export LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8
export EXPO_PUBLIC_API_URL="${EXPO_PUBLIC_API_URL:-https://rpg-api.codewaveds.com.br}"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export JAVA_HOME="${JAVA_HOME:-/Applications/Android Studio.app/Contents/jbr/Contents/Home}"
export PATH="$JAVA_HOME/bin:$PATH"
OUT="build-apk"

[ -f keystore/credentials.env ] || { echo "ERRO: keystore/credentials.env ausente"; exit 1; }
# shellcheck disable=SC1091
source keystore/credentials.env

APKSIGNER="$(ls -d "$ANDROID_HOME"/build-tools/*/apksigner | sort -V | tail -1)"

rm -rf "$OUT"; mkdir -p "$OUT"

npx expo prebuild --platform android --no-install
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
(cd android && ./gradlew assembleRelease --no-daemon)

SRC="android/app/build/outputs/apk/release/app-release.apk"
[ -f "$SRC" ] || { echo "ERRO: APK não encontrado"; exit 1; }

# Reassina com o keystore próprio (o template do Expo assina com a chave debug)
"$APKSIGNER" sign --ks keystore/fichasrpg.jks --ks-key-alias "$KEY_ALIAS" \
  --ks-pass "pass:$STORE_PASSWORD" --key-pass "pass:$KEY_PASSWORD" \
  --out "$OUT/FichasRPG.apk" "$SRC"
"$APKSIGNER" verify "$OUT/FichasRPG.apk"

echo "APK gerado: $(pwd)/$OUT/FichasRPG.apk"
