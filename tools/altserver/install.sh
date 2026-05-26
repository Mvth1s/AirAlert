#!/usr/bin/env bash
set -e

# Vérifie les prérequis
check_dep() {
  command -v "$1" &>/dev/null || { echo "Erreur : '$1' non trouvé. Installez : sudo apt install $2"; exit 1; }
}

check_dep docker       "docker.io"
check_dep idevice_id   "libimobiledevice-utils"

# Démarre usbmuxd si nécessaire
if ! systemctl is-active --quiet usbmuxd 2>/dev/null; then
  echo "Démarrage de usbmuxd..."
  sudo systemctl start usbmuxd
fi

# Charge le .env
if [ ! -f .env ]; then
  echo "Fichier .env manquant. Copiez .env.example :"
  echo "  cp .env.example .env && nano .env"
  exit 1
fi
set -a; source .env; set +a

# Auto-détection UDID si absent
if [ -z "$DEVICE_UDID" ]; then
  echo "Détection de l'iPhone..."
  DEVICE_UDID=$(idevice_id -l | head -1)
  if [ -z "$DEVICE_UDID" ]; then
    echo "Erreur : aucun iPhone détecté. Branchez l'iPhone et validez 'Faire confiance'."
    exit 1
  fi
  echo "iPhone trouvé : $DEVICE_UDID"
fi

# Télécharge l'IPA depuis la dernière release si absent
IPA_PATH="${IPA_PATH:-/tmp}"
if [ ! -f "$IPA_PATH/AirAlert.ipa" ]; then
  echo "Téléchargement de la dernière version d'AirAlert..."
  curl -L -o "$IPA_PATH/AirAlert.ipa" \
    "https://github.com/Mvth1s/AirAlert/releases/latest/download/AirAlert.ipa"
fi

echo "Installation sur l'iPhone ($DEVICE_UDID)..."
DEVICE_UDID="$DEVICE_UDID" docker compose up --build
