# CI/CD — AirAlert

## Vue d'ensemble

Le pipeline GitHub Actions se décompose en trois jobs :

| Job | Runner | Déclencheur | Rôle |
|---|---|---|---|
| `lint` | ubuntu-latest | PR + push main | ESLint + type-check |
| `build-ios` | macos-latest | après `lint` | Build Xcode non signé + artifact |
| `distribute-testflight` | macos-latest | push main uniquement | Signature + envoi TestFlight |

---

## Secrets GitHub requis

Configurez ces secrets dans **Settings → Secrets and variables → Actions** de votre dépôt.

### Pour le build signé et TestFlight

| Secret | Valeur |
|---|---|
| `APPLE_DISTRIBUTION_CERTIFICATE_BASE64` | Certificat `.p12` encodé en base64 (voir ci-dessous) |
| `APPLE_DISTRIBUTION_CERTIFICATE_PASSWORD` | Mot de passe du `.p12` |
| `KEYCHAIN_PASSWORD` | Mot de passe arbitraire pour le keychain temporaire CI |
| `PROVISIONING_PROFILE_BASE64` | Provisioning profile `.mobileprovision` encodé en base64 |
| `CODE_SIGN_IDENTITY` | Ex : `Apple Distribution: John Doe (XXXXXXXXXX)` |
| `PROVISIONING_PROFILE_NAME` | Nom du profil tel qu'il apparaît dans Xcode |
| `APPLE_ID` | Votre Apple ID (email) |
| `APPLE_APP_SPECIFIC_PASSWORD` | Mot de passe spécifique à l'app généré sur appleid.apple.com |

### Exporter le certificat en base64

```bash
# Sur macOS, depuis Keychain Access → exporter en .p12, puis :
base64 -i certificate.p12 | pbcopy
# Collez le résultat dans le secret APPLE_DISTRIBUTION_CERTIFICATE_BASE64
```

### Exporter le provisioning profile en base64

```bash
# Le profil se trouve dans ~/Library/MobileDevice/Provisioning Profiles/
base64 -i "MonProfil.mobileprovision" | pbcopy
```

---

## ExportOptions.plist

Le job `distribute-testflight` requiert un fichier `ios/App/ExportOptions.plist`.
Créez-le depuis Xcode après un premier archive manuel (Product → Archive → Distribute App),
ou utilisez ce modèle :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store-connect</string>
    <key>teamID</key>
    <string>VOTRE_TEAM_ID</string>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
</dict>
</plist>
```

---

## Build local (sans CI)

```bash
# 1. Construire les assets web
pnpm build

# 2. Synchroniser avec Capacitor
npx cap sync ios

# 3. Ouvrir Xcode
npx cap open ios

# 4. Dans Xcode : sélectionner votre device/simulateur et lancer (⌘R)
```

---

## Désactiver TestFlight temporairement

Le job `distribute-testflight` ne se déclenche que sur push vers `main`.
Pour le désactiver ponctuellement, ajoutez `[skip cd]` dans le message de commit
ou supprimez le job du workflow.
