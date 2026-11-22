#!/usr/bin/env bash
# Gera um IPA SEM assinatura para ser instalado via AltStore/SideStore/Sideloadly
# (eles reassinam com o Apple ID gratuito). Uso: pnpm build:ipa
set -euo pipefail

cd "$(dirname "$0")/.."

export LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8
export EXPO_PUBLIC_API_URL="${EXPO_PUBLIC_API_URL:-https://rpg-api.codewaveds.com.br}"
SCHEME="FichasRPG"
OUT="build-ipa"

rm -rf "$OUT"
mkdir -p "$OUT"

# Atualiza o projeto nativo e os Pods (ios/ é gitignored e regenerável)
npx expo prebuild --platform ios --no-install
(cd ios && pod install)

# Build Release para dispositivo, sem assinatura
xcodebuild \
  -workspace "ios/$SCHEME.xcworkspace" \
  -scheme "$SCHEME" \
  -configuration Release \
  -sdk iphoneos \
  -destination "generic/platform=iOS" \
  -derivedDataPath "$OUT/derived" \
  CODE_SIGNING_ALLOWED=NO \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGN_IDENTITY="" \
  build

APP="$(find "$OUT/derived/Build/Products/Release-iphoneos" -maxdepth 1 -name '*.app' | head -1)"
[ -d "$APP" ] || { echo "ERRO: .app não encontrado"; exit 1; }

mkdir -p "$OUT/Payload"
cp -R "$APP" "$OUT/Payload/"
(cd "$OUT" && zip -qry "$SCHEME.ipa" Payload)

echo "IPA gerado: $(pwd)/$OUT/$SCHEME.ipa"
