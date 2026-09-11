# SwiftXpress.ca

Site officiel bilingue de SwiftXpress, service de livraison et messagerie à Montréal et dans les environs. Le projet utilise Next.js, TypeScript et PostgreSQL. Il est conçu pour un développement local avec Docker Compose et pour une future exécution sur Vercel avec une base PostgreSQL hébergée.

## Fonctionnalités

- pages françaises (`/fr`) et anglaises (`/en`) avec métadonnées, URL canoniques et `hreflang`;
- accueil, services, fonctionnement, offre aux entreprises, soumission et contact;
- navigation mobile accessible, liens téléphoniques et courriel;
- formulaire validé dans le navigateur et à nouveau sur le serveur;
- API publique en écriture seulement : `POST /api/quote-requests`;
- requêtes PostgreSQL paramétrées, rôle applicatif restreint et pool de connexions;
- anti-spam par champ leurre, délai minimal, contrôle d’origine, limite de corps et limitation de fréquence persistée en base;
- UUID, référence publique unique, statut et horodatages avec fuseau horaire;
- manifeste, favicon SVG, image Open Graph, sitemap, robots et données structurées;
- en-têtes de sécurité et politique CSP sans ressource tierce.

Aucun endpoint public ne permet de lire les demandes. Le rôle `swiftxpress_app` peut insérer une demande et lire uniquement la référence retournée; il ne peut pas lire les renseignements soumis.

## Prérequis

- Node.js 20.9 ou plus récent;
- npm;
- Docker avec le module Docker Compose.

## Installation locale

À la racine du projet :

```bash
cp .env.example .env
npm install
```

Modifier ensuite `.env` et remplacer toutes les valeurs `replace-with-...`. Les mots de passe présents dans les deux URL PostgreSQL doivent correspondre à `POSTGRES_OWNER_PASSWORD` et `POSTGRES_APP_PASSWORD`. Si un mot de passe contient un caractère réservé dans une URL, l’encoder dans les URL.

Le fichier `.env` est ignoré par Git. Ne jamais y placer des identifiants de production dans une copie partagée.

## Démarrer PostgreSQL

```bash
docker compose up -d postgres
docker compose ps
```

Le premier démarrage crée :

- la base indiquée par `POSTGRES_DB`;
- le propriétaire indiqué par `POSTGRES_OWNER_USER`;
- le rôle applicatif restreint `swiftxpress_app`.

Le volume `swiftxpress_postgres_data` conserve les données après un `docker compose down`.

## Appliquer les migrations

```bash
npm run db:migrate
```

Le script lit `DATABASE_ADMIN_URL`, applique dans l’ordre les fichiers de `migrations/`, enregistre leur empreinte SHA-256 dans `schema_migrations` et refuse la modification d’une migration déjà appliquée. Pour modifier le schéma, ajouter une nouvelle migration numérotée.

## Lancer le site

```bash
npm run dev
```

Ouvrir ensuite [http://localhost:3000](http://localhost:3000). La racine redirige vers `/fr`; `/en` affiche la version anglaise.

## Vérifications et tests

Tests unitaires de validation, sécurité, API et requêtes :

```bash
npm test
```

Test d’intégration avec le vrai PostgreSQL local, après le démarrage du conteneur et les migrations :

```bash
npm run db:migrate
npm run test:db
```

Autres commandes :

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run build
npm run verify
```

`npm run verify` exécute le lint, la vérification TypeScript, les tests unitaires et le build de production. Le test PostgreSQL reste séparé car il requiert Docker.

## Variables d’environnement

| Variable | Utilisation |
| --- | --- |
| `DATABASE_URL` | Connexion d’exécution avec le rôle applicatif restreint; seule URL nécessaire au site sur Vercel. |
| `DATABASE_ADMIN_URL` | Connexion propriétaire utilisée seulement pour les migrations et tests d’intégration. |
| `DATABASE_SSL` | `true` pour activer TLS avec une base hébergée. |
| `DATABASE_SSL_REJECT_UNAUTHORIZED` | Conserver `true` sauf exigence documentée du fournisseur. |
| `DATABASE_POOL_MAX` | Taille locale du pool par instance, limitée à 10 par le code. |
| `RATE_LIMIT_SALT` | Secret aléatoire d’au moins 32 caractères servant à hacher l’identifiant réseau. |
| `RATE_LIMIT_MAX` | Nombre de soumissions permis par fenêtre. |
| `RATE_LIMIT_WINDOW_SECONDS` | Durée de la fenêtre de limitation. |
| `ALLOWED_ORIGINS` | Origines additionnelles autorisées, séparées par des virgules. |
| `POSTGRES_*` | Initialisation du conteneur PostgreSQL local uniquement. |

## Préparation pour Vercel

Le projet utilise le runtime Node.js pour l’API PostgreSQL, un pool attaché au cycle de vie des fonctions Vercel et aucune dépendance à la base locale. Pour préparer une mise en production sans effectuer de déploiement :

1. créer une base PostgreSQL hébergée dans une région proche de l’application;
2. créer un utilisateur applicatif à privilèges minimaux et placer son URL dans `DATABASE_URL`;
3. configurer `DATABASE_SSL=true`, un `RATE_LIMIT_SALT` aléatoire et les autres variables de `.env.example` dans les paramètres Vercel;
4. utiliser une connexion propriétaire temporaire dans `DATABASE_ADMIN_URL` pour exécuter `npm run db:migrate` depuis un environnement de confiance;
5. retirer `DATABASE_ADMIN_URL` du runtime Vercel après migration si elle n’y est pas nécessaire;
6. vérifier localement l’artefact avec :

```bash
npm ci
npm run verify
```

La commande de build attendue par Vercel est `npm run build`. Aucun déploiement, courriel automatique ou service payant n’est déclenché par ce projet.

## Structure utile

- `app/[locale]/` : pages et métadonnées localisées;
- `app/api/quote-requests/route.ts` : unique endpoint de soumission;
- `components/` : interface, navigation et formulaire;
- `lib/validation.ts` : schéma partagé client/serveur;
- `lib/security.ts` : limites de corps, origine, identifiant haché;
- `lib/quote-repository.ts` : seules requêtes applicatives;
- `migrations/` : schéma versionné et privilèges;
- `scripts/migrate.ts` : exécuteur de migrations;
- `tests/` : tests unitaires et test PostgreSQL optionnel.
