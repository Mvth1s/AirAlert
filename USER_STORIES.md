# User Stories — AirAlert

**Version** : 1.0  
**Date** : Mai 2026  

---

## Epics

1. [EP01 — Onboarding & Permissions](#ep01--onboarding--permissions)
2. [EP02 — Connexion & Détection BLE](#ep02--connexion--détection-ble)
3. [EP03 — Affichage de la batterie](#ep03--affichage-de-la-batterie)
4. [EP04 — Notifications](#ep04--notifications)
5. [EP05 — Paramètres](#ep05--paramètres)

---

## EP01 — Onboarding & Permissions

### US-01 — Demande de permission Bluetooth
**En tant qu'** utilisateur lançant l'app pour la première fois,  
**Je veux** comprendre pourquoi l'app a besoin d'accéder au Bluetooth,  
**Afin de** donner mon accord en connaissance de cause.

**Critères d'acceptation :**
- Une explication claire s'affiche avant le prompt système iOS
- Le prompt natif iOS de permission Bluetooth est déclenché
- Si refusée, l'app affiche un message d'erreur et un lien vers les Réglages

---

### US-02 — Demande de permission Notifications
**En tant qu'** utilisateur lançant l'app pour la première fois,  
**Je veux** décider si je veux recevoir des notifications de l'app,  
**Afin de** contrôler mes alertes.

**Critères d'acceptation :**
- Le prompt natif iOS de permission Notifications est déclenché après le Bluetooth
- Si refusée, les fonctionnalités de notification sont désactivées avec un message explicatif
- L'utilisateur peut activer les notifications plus tard depuis les Paramètres de l'app

---

### US-03 — Écran d'accueil sans AirPods
**En tant qu'** utilisateur dont les AirPods ne sont pas connectés,  
**Je veux** voir un état vide clair,  
**Afin de** comprendre que l'app attend une connexion.

**Critères d'acceptation :**
- Un message "Aucun AirPods détecté" s'affiche
- Un bouton "Rechercher" permet de relancer le scan BLE manuellement
- L'état se met à jour automatiquement dès qu'une paire est détectée

---

## EP02 — Connexion & Détection BLE

### US-04 — Détection automatique des AirPods
**En tant qu'** utilisateur avec des AirPods connectés à mon iPhone,  
**Je veux** que l'app les détecte automatiquement,  
**Afin de** ne pas avoir à faire de manipulation manuelle.

**Critères d'acceptation :**
- L'app identifie les AirPods parmi les périphériques BLE connectés
- La détection se fait en moins de 5 secondes après ouverture de l'app
- Le nom de la paire d'AirPods (ex. "AirPods de Mathis") s'affiche

---

### US-05 — Reconnexion automatique
**En tant qu'** utilisateur dont les AirPods se déconnectent temporairement,  
**Je veux** que l'app se reconnecte automatiquement,  
**Afin de** ne pas avoir à relancer l'app manuellement.

**Critères d'acceptation :**
- Si la connexion BLE est perdue, l'app affiche "Reconnexion en cours..."
- La reconnexion se fait automatiquement dès que les AirPods sont à nouveau disponibles
- Aucune action manuelle requise

---

## EP03 — Affichage de la batterie

### US-06 — Affichage du niveau de batterie
**En tant qu'** utilisateur,  
**Je veux** voir le niveau de batterie de mes deux écouteurs,  
**Afin de** savoir combien d'autonomie il me reste.

**Critères d'acceptation :**
- Le pourcentage de batterie est affiché pour l'écouteur gauche et droit
- L'affichage se met à jour toutes les 60 secondes au premier plan
- Une icône ou couleur indique l'état (normal / avertissement / critique)

---

### US-07 — Indicateur d'état visuel
**En tant qu'** utilisateur,  
**Je veux** distinguer visuellement les niveaux d'alerte,  
**Afin de** comprendre l'urgence d'un coup d'œil.

**Critères d'acceptation :**
- Batterie > seuil avertissement : couleur verte
- Batterie ≤ seuil avertissement (défaut 15%) : couleur orange
- Batterie ≤ seuil critique (défaut 5%) : couleur rouge + icône d'alerte

---

### US-08 — Compatibilité non garantie
**En tant qu'** utilisateur dont les AirPods ne supportent pas le BLE Battery Service,  
**Je veux** être informé clairement,  
**Afin de** comprendre pourquoi la batterie n'est pas affichée.

**Critères d'acceptation :**
- Un message "Batterie non disponible pour ce modèle" s'affiche en cas d'échec de lecture
- Un lien vers la FAQ explique les limitations techniques

---

## EP04 — Notifications

### US-09 — Notification d'avertissement (15%)
**En tant qu'** utilisateur,  
**Je veux** recevoir une notification quand la batterie de mes AirPods descend à ≤ 15%,  
**Afin d'** anticiper une recharge avant de tomber à court.

**Critères d'acceptation :**
- Une notification locale est envoyée dès que le seuil est franchi
- Le message précise l'écouteur concerné et le pourcentage actuel
- La notification n'est envoyée qu'une seule fois par session de charge
- La notification fonctionne en arrière-plan

**Exemple de message :**  
> 🔋 AirAlert — Batterie faible  
> Écouteur gauche : 14% — Pensez à recharger vos AirPods.

---

### US-10 — Notification critique (5%)
**En tant qu'** utilisateur,  
**Je veux** recevoir une notification urgente quand la batterie descend à ≤ 5%,  
**Afin d'** éviter une coupure audio imprévue.

**Critères d'acceptation :**
- Une notification critique est envoyée dès que le seuil est franchi
- La notification est distincte visuellement de la notification d'avertissement
- La notification n'est envoyée qu'une seule fois par session de charge

**Exemple de message :**  
> 🚨 AirAlert — Batterie critique  
> Écouteur droit : 4% — Rechargez vos AirPods immédiatement.

---

### US-11 — Anti-spam des notifications
**En tant qu'** utilisateur,  
**Je veux** ne pas recevoir la même notification en boucle,  
**Afin de** ne pas être spammé.

**Critères d'acceptation :**
- Chaque seuil ne déclenche qu'une seule notification par session de décharge
- Si la batterie remonte au-dessus du seuil (recharge), les alertes sont réinitialisées

---

## EP05 — Paramètres

### US-12 — Personnalisation des seuils
**En tant qu'** utilisateur,  
**Je veux** modifier les seuils de notification selon mes préférences,  
**Afin d'** adapter l'app à mon usage.

**Critères d'acceptation :**
- Seuil d'avertissement : réglable de 5% à 50% (défaut : 15%)
- Seuil critique : réglable de 1% à 20% (défaut : 5%)
- Le seuil critique ne peut pas être supérieur ou égal au seuil d'avertissement
- Les modifications sont sauvegardées localement (persist entre les sessions)

---

### US-13 — Activation/désactivation des notifications
**En tant qu'** utilisateur,  
**Je veux** pouvoir désactiver un type de notification,  
**Afin de** ne recevoir que les alertes qui m'intéressent.

**Critères d'acceptation :**
- Toggle pour activer/désactiver la notification d'avertissement
- Toggle pour activer/désactiver la notification critique
- L'état est sauvegardé entre les sessions

---

### US-14 — Réinitialisation des paramètres
**En tant qu'** utilisateur,  
**Je veux** pouvoir réinitialiser mes paramètres aux valeurs par défaut,  
**Afin de** repartir de zéro facilement.

**Critères d'acceptation :**
- Un bouton "Réinitialiser les paramètres" est disponible
- Une confirmation est demandée avant la réinitialisation
- Les valeurs par défaut sont rétablies immédiatement

---

## Récapitulatif

| ID | Epic | Priorité | Statut |
|---|---|---|---|
| US-01 | Onboarding | MUST | 🔲 À faire |
| US-02 | Onboarding | MUST | 🔲 À faire |
| US-03 | Onboarding | SHOULD | 🔲 À faire |
| US-04 | BLE | MUST | 🔲 À faire |
| US-05 | BLE | SHOULD | 🔲 À faire |
| US-06 | Batterie | MUST | 🔲 À faire |
| US-07 | Batterie | SHOULD | 🔲 À faire |
| US-08 | Batterie | SHOULD | 🔲 À faire |
| US-09 | Notifications | MUST | 🔲 À faire |
| US-10 | Notifications | MUST | 🔲 À faire |
| US-11 | Notifications | MUST | 🔲 À faire |
| US-12 | Paramètres | SHOULD | 🔲 À faire |
| US-13 | Paramètres | SHOULD | 🔲 À faire |
| US-14 | Paramètres | COULD | 🔲 À faire |
