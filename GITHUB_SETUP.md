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

## 3️⃣ (Recommandé) Sécuriser les Clés 🔒

Bien que le script fonctionne avec des clés par défaut ("fallback"), il est **très important** de configurer les Secrets GitHub pour que votre indexeur reste fonctionnel si nous changeons les clés à l'avenir.

Voici la procédure détaillée :

### Étape A : Récupérer vos clés Supabase
1.  Connectez-vous à votre [Tableau de bord Supabase](https://supabase.com/dashboard).
2.  Selectionnez votre projet.
3.  Allez dans **Settings** (icône engrenage en bas à gauche) > **API**.
4.  Vous aurez besoin de :
    - **URL** : L'URL du projet (ex: `https://xyz.supabase.co`).
    - **service_role** (Secret) : La clé secrète qui contourne les protections (Attention : ne partagez jamais cette clé !).

### Étape B : Ajouter les secrets dans GitHub
1.  Allez sur la page principale de votre dépôt **GitHub**.
2.  Cliquez sur l'onglet **Settings** (le dernier onglet en haut à droite, icône engrenage).
3.  Dans le menu de gauche, descendez jusqu'à la section **Security**.
4.  Cliquez sur **Secrets and variables** > **Actions**.
5.  Cliquez sur le bouton vert **New repository secret**.

### Étape C : Créer les 3 variables
Créez ces 3 secrets en répétant l'opération :

#### Secret 1
- **Name**: `SUPABASE_URL`
- **Secret**: *(Collez votre URL Supabase ici)*
- *Cliquez sur "Add secret"*

#### Secret 2
- **Name**: `SUPABASE_KEY`
- **Secret**: *(Collez votre clé `service_role` ici)*
- *Cliquez sur "Add secret"*

#### Secret 3
- **Name**: `NODE_URL`
- **Secret**: `http://34.66.15.88:3001`
- *Cliquez sur "Add secret"*

✅ Une fois ces 3 secrets ajoutés, le script les utilisera automatiquement à la prochaine exécution.
