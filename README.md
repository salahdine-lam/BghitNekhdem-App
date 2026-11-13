# 🚀 Bghit nekhdem (بغيت نخدم) — AI Job Matcher & Real-Time Scanner

<div align="center">

![Bghit nekhdem Banner](https://raw.githubusercontent.com/salahdine-lam/BghitNekhdem-App/main/public/logo.svg)

### 🌐 Application en ligne : [https://bghit-nekhdem-app.vercel.app/](https://bghit-nekhdem-app.vercel.app/)

**Plateforme intelligente d'analyse de CV par IA et de matching d'offres d'emploi en temps réel (Maroc & International).**

[![Live Demo](https://img.shields.io/badge/Demo-En%20Ligne%20(Vercel)-0A66C2?style=for-the-badge&logo=vercel)](https://bghit-nekhdem-app.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Accéder à l'application](https://bghit-nekhdem-app.vercel.app/) • [Fonctionnalités](#-fonctionnalités-clés) • [Architecture](#-architecture-technique) • [Plateformes Scannées](#-plateformes-scannées-en-temps-réel) • [Installation](#-installation-locale)

</div>

---

## 📌 Présentation

**Bghit nekhdem** est une application conçue pour révolutionner la recherche d'emploi. L'utilisateur dépose simplement son CV (PDF, DOCX ou texte brut), et le moteur extrait son profil complet pour aller scanner en temps réel les plus grandes plateformes de recrutement. 

L'application filtre et classe automatiquement les offres avec un seuil d'exigence strict : **seules les offres matchant à plus de 60% sont retenues**, avec un lien direct vers l'annonce officielle pour postuler.

---

## ✨ Fonctionnalités Clés

* 📄 **Parsing Universel de CV** :
  * Extraction côté serveur de fichiers `.pdf` (via `pdf-parse`) et `.docx` (via `mammoth`).
  * Détection automatique des compétences parmi 70+ technologies et métiers (IT, Cloud/DevOps, Cybersécurité, Data/IA, Finance, Contrôle de Gestion, Audit, Product, Marketing, RH, Supply Chain).
  * Détection automatique des années d'expérience, niveau de séniorité et rôles cibles.
* 🛰️ **Scanner Multi-Plateformes en Temps Réel** :
  * Scan en direct de **LinkedIn Jobs**, **Rekrute.com**, **Emploi.ma** et du portail public **Emploi-Public.ma**.
  * Liens externes profonds menant directement à la fiche du poste sur le site d'origine.
* 🎯 **Algorithme de Matching Tripartite (≥ 60%)** :
  * $40\%$ Couverture des compétences requises (Must-have vs Nice-to-have).
  * $40\%$ Alignement sémantique et intitulé de poste.
  * $20\%$ Adéquation séniorité et années d'expérience.
* 🛡️ **Skill Gap Analysis & Conseils ATS** :
  * Affichage des compétences validées vs compétences manquantes.
  * Ajout d'une compétence en 1 clic pour recalculer immédiatement le score prévisionnel.
  * Recommandations d'optimisation pour passer les filtres ATS.
* ✍️ **Générateur de Pitch d'Accroche IA** :
  * Message de motivation personnalisé prêt à être copié et envoyé aux recruteurs sur LinkedIn.
* 🎨 **Design System Professionnel (LinkedIn UI)** :
  * Layout 3 colonnes optimisé pour desktop et mobile.
  * Sélecteur de thème **Clair / Sombre** persistant dans le navigateur.
* 🤖 **Support Hybride IA (Gemini 2.0 Flash)** :
  * Moteur NLP autonome local sans frais ni quota.
  * Option de connexion avec une clé API **Google Gemini 2.0 Flash** pour analyse structurée avancée.

---

## 🌐 Plateformes Scannées en Temps Réel

| Plateforme | Type d'accès | Couverture |
| :--- | :--- | :--- |
| **LinkedIn Jobs** | Temps réel (API Guest) | Offres IT, Cadres, Télétravail & International |
| **Rekrute.com** | Temps réel (Scraping live) | Marché Maroc, Grands Comptes & Multinationales |
| **Emploi.ma** | Temps réel (Scraping live) | Offres nationales tous secteurs |
| **Emploi-Public.ma** | Temps réel (Portail officiel) | Concours et recrutements de la fonction publique marocaine |
| **Indeed / Dreamjob** | Télémétrie d'état | Indication transparente du statut anti-bot |

---

## 🛠️ Architecture Technique

```
bghit-nekhdem/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── parse-cv/route.ts     # Extraction & parsing de CV (Serveur)
│   │   │   ├── scan-jobs/route.ts    # Scanner multi-plateformes en direct
│   │   │   └── live-jobs/route.ts    # Connecteur flux web
│   │   ├── globals.css               # Design tokens LinkedIn & Mode Sombre
│   │   ├── layout.tsx                # Metadata & Thème racine
│   │   └── page.tsx                  # Dashboard principal 3 colonnes
│   ├── components/
│   │   ├── Navbar.tsx                # Barre de navigation, recherche & switch thème
│   │   ├── ProfileSidebar.tsx        # Profil candidat, drag&drop CV & compétences
│   │   ├── JobFeedCard.tsx           # Cartes d'offres matchées ≥ 60%
│   │   └── JobDetailInspector.tsx    # Diagnostic IA, Skill Gap & pitch de candidature
│   ├── data/
│   │   └── mockData.ts               # Profils démo et catalogue enrichi
│   ├── lib/
│   │   ├── cvParser.ts               # Dictionnaire de compétences & heuristiques
│   │   ├── jobLinks.ts               # Résolveur de liens profonds externes
│   │   └── matchingEngine.ts         # Moteur de scoring tripartite
│   └── types/
│       └── index.ts                  # Interfaces TypeScript strictes
├── next.config.mjs                   # Configuration serveur Next.js
├── tailwind.config.ts                # Configuration Tailwind (dark mode: class)
└── package.json
```

---

## 💻 Installation Locale

1. **Cloner le projet :**
   ```bash
   git clone https://github.com/salahdine-lam/BghitNekhdem-App.git
   cd BghitNekhdem-App
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```
   L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

4. **Tester le build de production :**
   ```bash
   npm run build
   ```

---

## 🌐 Déploiement en Production

L'application est déployée en continu sur **Vercel** avec CDN mondial et certificat HTTPS :
* **Accès direct :** **[https://bghit-nekhdem-app.vercel.app/](https://bghit-nekhdem-app.vercel.app/)**
* Chaque mise à jour poussée sur la branche `main` de ce dépôt GitHub déclenche un redéploiement automatique en moins d'une minute.

---

## 📄 Licence

Ce projet est sous licence MIT — libre d'utilisation et de modification.
