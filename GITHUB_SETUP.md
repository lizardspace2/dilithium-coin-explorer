# 🚀 Installation de l'Indexeur Automatique sur GitHub

Ce guide vous permet d'activer le **cron job** qui indexera la blockchain toutes les 30 minutes via GitHub Actions.

## 1️⃣ Envoyer le code sur GitHub (Push)

Ouvrez votre terminal dans ce dossier (`dilithium-coin-explorer`) et lancez les commandes suivantes pour envoyer le nouveau script et la configuration du workflow :

```bash
git add indexer/cron_script.js .github/workflows/indexer.yml
git commit -m "feat: setup github action indexer"
git push origin main
```
*(Si votre branche principale est `master` et non `main`, remplacez `main` par `master`)*

---

## 2️⃣ Vérifier que ça marche

1.  Allez sur votre dépôt **GitHub**.
2.  Cliquez sur l'onglet **Actions** (en haut).
3.  Dans la liste à gauche, cliquez sur **Blockchain Indexer**.
4.  Vous verrez peut-être déjà un workflow en attente ou en cours (dû au `push`).

### Lancer manuellement (Test immédiat)
Si vous ne voulez pas attendre 30 minutes :
1.  Sur la page **Blockchain Indexer**, cliquez sur le bouton gris **Run workflow** (à droite).
2.  Validez le bouton vert **Run workflow**.
3.  Une ligne d'exécution va apparaître après quelques secondes. Cliquez dessus pour voir les logs.

---

## 3️⃣ (Optionnel) Sécuriser les Clés

Le script fonctionne actuellement avec des clés par défaut pour faciliter l'installation. Pour une sécurité optimale, configurez les "Secrets" GitHub :

1.  Allez dans **Settings** > **Secrets and variables** > **Actions**.
2.  Ajoutez les secrets suivants :
    - `SUPABASE_URL`
    - `SUPABASE_KEY` (La clé `service_role` secrète)
    - `NODE_URL` (`http://34.66.15.88:3001`)

Le script utilisera automatiquement ces valeurs dès qu'elles seront définies.
