# 🎓 Student Management System - Backend C# (DevOps)

Ce projet constitue la partie Backend d'une application de gestion d'étudiants, réalisée dans le cadre du projet DevOps à l'**EFREI Paris**. Il met en œuvre une architecture conteneurisée avec un pipeline de déploiement continu.

## 🚀 Technologies Utilisées
* **Langage :** C# / .NET 7.0
* **API :** ASP.NET Core Web API (REST)
* **Base de données :** MySQL 8.0
* **Conteneurisation :** Docker & Docker Compose
* **Documentation :** Swagger / OpenAPI
* **CI/CD :** GitHub Actions & GitHub Container Registry (GHCR)

## 🛠️ Architecture & Orchestration
L'application est entièrement orchestrée via Docker. Le fichier `docker-compose.yml` à la racine permet de lancer simultanément :
1.  **Le Backend :** API C# écoutant sur le port `5020`.
2.  **La Database :** Serveur MySQL avec initialisation automatique du schéma via un script `init.sql`.

## 📦 Installation et Lancement Rapide

### Prérequis
* Docker et Docker Compose installés sur votre machine (ou WSL2 pour Windows).

### Lancement
Depuis la racine du projet, exécutez la commande suivante :
```bash
docker compose up --build

```

L'API sera alors accessible à l'adresse : **[http://localhost:5020]()**

## 📖 Documentation de l'API (Swagger)

Une interface interactive Swagger est disponible pour tester les différents endpoints (GET, POST, etc.) :
👉 **[http://localhost:5020/swagger]()**

## 🔄 Pipeline CI/CD (Membre 2)

Un workflow GitHub Actions a été mis en place pour automatiser le cycle de vie du logiciel :

1. **Intégration Continue (CI) :** À chaque push, le code est restauré et compilé sous .NET 7 pour vérifier l'absence de régressions.
2. **Déploiement Continu (CD) :** Après une compilation réussie, une image Docker est automatiquement construite et publiée sur le **GitHub Container Registry (GHCR)**.

**Lien vers les images publiées :** `ghcr.io/[votre-pseudo-github]/projet-devops-backend:latest`

## 📂 Structure du dossier Backend

* `/StudentApi` : Code source de l'API C#.
* `/database` : Contient le script `init.sql` pour la création automatique des tables.
* `Dockerfile` : Instructions de build multi-stage pour optimiser la taille de l'image finale.

```

---

### Pourquoi ce README va te faire gagner des points :
1.  **Mise en avant du rôle :** Tu précises bien que c'est le travail du **Membre 2**.
2.  **Clarté :** Le jury peut lancer ton projet en une seule commande (`docker compose up`).
3.  **Preuve technique :** Tu mentionnes le **GHCR** et le **Build Multi-stage**, ce qui montre que tu maîtrises les concepts avancés de Docker.

**Une fois ce fichier enregistré, fais ton commit final :**
```bash
git add .
git commit -m "docs: finalize technical README for Sprint 3"
git push

```

**C'est la fin du Sprint 3 pour toi !** Est-ce que tu veux que je vérifie une dernière chose sur tes fichiers avant que tu ne rendes le projet ?