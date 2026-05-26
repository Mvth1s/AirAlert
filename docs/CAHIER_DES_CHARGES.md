# Cahier des Charges — AirAlert

**Version** : 1.0  
**Date** : Mai 2026  
**Statut** : Draft  

---

## 1. Contexte et problème

Les AirPods n'avertissent l'utilisateur de leur niveau de batterie que de manière passive (via le widget iOS ou l'animation d'ouverture du boîtier). Il n'existe pas de système de notification proactive et configurable par l'utilisateur pour être alerté avant que les écouteurs ne se déchargent complètement.

AirAlert répond à ce besoin en surveillant la batterie des AirPods en arrière-plan et en envoyant des notifications locales selon des seuils définis.

---

## 2. Objectifs

### Objectif principal
Développer une application iOS open-source permettant de recevoir des notifications locales lorsque la batterie des AirPods descend sous des seuils configurables.

### Objectifs secondaires
- Fournir une interface claire affichant l'état de la batterie des deux écouteurs
- Permettre à l'utilisateur de personnaliser les seuils d'alerte
- Respecter scrupuleusement les guidelines Apple et les APIs publiques iOS
- Publier le code source sous licence MIT sur GitHub

---

## 3. Périmètre

### Dans le périmètre (In Scope)
- Détection des AirPods connectés via Bluetooth Low Energy
- Lecture du niveau de batterie des écouteurs gauche et droit (BLE Battery Service UUID `0x180F`)
- Notification locale à **≤ 15%** de batterie (avertissement)
- Notification locale à **≤ 5%** de batterie (alerte critique)
- Seuils personnalisables par l'utilisateur
- Surveillance en arrière-plan (background BLE mode iOS)
- Application iOS uniquement

### Hors périmètre (Out of Scope)
- Batterie du boîtier AirPods (API propriétaire Apple, non accessible)
- Application Android
- Application macOS (projet distinct potentiel)
- Synchronisation cloud ou compte utilisateur
- Support d'autres marques d'écouteurs Bluetooth (évolution possible)

---

## 4. Fonctionnalités détaillées

### F01 — Détection des AirPods
- L'application scanne les périphériques BLE à proximité
- Elle identifie les AirPods connectés parmi les périphériques disponibles
- Elle se reconnecte automatiquement si la connexion est perdue

### F02 — Affichage de la batterie
- Affiche le niveau de batterie de l'écouteur gauche (en %)
- Affiche le niveau de batterie de l'écouteur droit (en %)
- Actualisation toutes les 60 secondes lorsque l'app est au premier plan
- Indicateur visuel de l'état (normal / avertissement / critique)

### F03 — Notifications locales
- Notification de **niveau 1** (avertissement) : batterie ≤ seuil configurable (défaut : 15%)
- Notification de **niveau 2** (critique) : batterie ≤ seuil configurable (défaut : 5%)
- Une seule notification par seuil par session de charge (pas de répétition)
- Les notifications fonctionnent lorsque l'app est en arrière-plan

### F04 — Paramètres
- Personnalisation du seuil d'avertissement (5% à 50%, défaut : 15%)
- Personnalisation du seuil critique (1% à 20%, défaut : 5%)
- Activation / désactivation des notifications par niveau
- Réinitialisation des paramètres aux valeurs par défaut

### F05 — Onboarding
- Demande de permission Bluetooth au premier lancement
- Demande de permission Notifications au premier lancement
- Explication claire de l'utilisation des permissions (requis App Store)

---

## 5. Contraintes techniques

### Bluetooth Low Energy (BLE)
- Utilisation exclusive des APIs publiques iOS (CoreBluetooth via Capacitor plugin)
- Service BLE Battery Service standard : UUID `0x180F`
- Caractéristique Battery Level : UUID `0x2A19`
- La compatibilité dépend de la génération d'AirPods et de la version iOS
- En arrière-plan : iOS autorise le BLE uniquement pour les périphériques **déjà connectés** (mode `bluetooth-central` dans le background modes d'iOS)

### Performance et batterie
- La surveillance BLE en arrière-plan doit minimiser l'impact sur la batterie de l'iPhone
- Intervalle de polling en arrière-plan : selon les contraintes iOS (non garanti, géré par le système)

### Compatibilité
- iOS 15.0 minimum
- iPhone uniquement (pas d'iPad pour v1)
- AirPods 2e génération et ultérieurs (compatibilité BLE Battery Service à documenter au fur et à mesure des tests)

---

## 6. Contraintes légales et App Store

### Apple App Store Guidelines
- Respect de la [guideline 5.1.1](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage) sur la collecte de données
- Aucune utilisation d'APIs privées Apple (pas d'AAP, pas d'IOBluetooth)
- `NSBluetoothAlwaysUsageDescription` obligatoire dans `Info.plist`
- Justification claire de l'usage Bluetooth dans le formulaire de soumission App Store

### Données personnelles (RGPD / App Store Privacy Nutrition Label)
- **Aucune donnée collectée** : pas d'analytics, pas de crash reporting tiers, pas de publicité
- Privacy Nutrition Label : "No data collected"
- Politique de confidentialité hébergée publiquement (GitHub Pages ou équivalent) — obligatoire même si aucune donnée n'est collectée

### Licence open-source
- Licence MIT
- Les contributions extérieures sont acceptées via Pull Requests

---

## 7. Limitations connues (à documenter dans l'app)

| Limitation | Cause | Impact |
|---|---|---|
| Batterie du boîtier non affichée | API propriétaire Apple (AAP) | Fonctionnalité absente |
| Compatibilité non garantie | BLE Battery Service optionnel selon génération AirPods | Possible non-fonctionnement |
| Surveillance arrière-plan limitée | iOS gère lui-même le scheduling BLE background | Délai possible dans les notifications |
| Pas d'Android | Hors périmètre v1 | — |

---

## 8. Critères d'acceptation

| ID | Critère | Priorité |
|---|---|---|
| AC01 | L'app détecte les AirPods connectés et affiche leur batterie | MUST |
| AC02 | Une notification est envoyée quand la batterie ≤ 15% | MUST |
| AC03 | Une notification est envoyée quand la batterie ≤ 5% | MUST |
| AC04 | Les seuils sont modifiables dans les paramètres | SHOULD |
| AC05 | L'app fonctionne en arrière-plan (best effort iOS) | SHOULD |
| AC06 | Aucune API privée Apple n'est utilisée | MUST |
| AC07 | La politique de confidentialité est disponible publiquement | MUST |
| AC08 | L'app passe la review App Store | MUST |

---

## 9. Livrables

- Code source sur GitHub (public, MIT)
- Application publiée sur l'App Store (gratuite)
- Documentation technique (ARCHITECTURE.md)
- Politique de confidentialité (PRIVACY.md)
- Pipeline CI/CD GitHub Actions pour build iOS automatique
