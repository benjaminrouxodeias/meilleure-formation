# meilleure-formation.cloud

Comparateur SaaS de formations business francophones en ligne.

## Stack technique

- **Frontend** : Next.js 14 (App Router) + Tailwind CSS + TypeScript
- **Backend/BDD** : Supabase (PostgreSQL + Auth + API)
- **Déploiement** : Vercel
- **Paiements** : Stripe (structure prête, intégration ultérieure)

## Démarrage rapide

### 1. Cloner et installer

```bash
git clone <repo>
cd meilleure-formation
npm install
```

### 2. Configurer Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Copier `.env.example` en `.env.local` et renseigner les variables :

```bash
cp .env.example .env.local
```

3. Exécuter les migrations SQL dans l'éditeur SQL de Supabase :
   - `supabase/migrations/001_schema.sql` — tables, index, RLS
   - `supabase/migrations/002_seed.sql` — données initiales (catégories, formations, avis)

### 3. Lancer le dev

```bash
npm run dev
```

Le site est disponible sur [http://localhost:3000](http://localhost:3000).

### 4. Déployer sur Vercel

1. Connecter le repo GitHub à Vercel
2. Ajouter les variables d'environnement dans les settings Vercel
3. Déployer

## Structure du projet

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Layout global
│   ├── sitemap.ts                  # Sitemap dynamique
│   ├── robots.ts                   # robots.txt
│   ├── categorie/[slug]/page.tsx   # Pages catégorie avec SEO
│   ├── formations/[slug]/page.tsx  # Fiches formation
│   ├── comparateur/page.tsx        # Moteur de matching
│   ├── laisser-un-avis/[slug]/     # Formulaire d'avis
│   ├── revendiquer-ma-fiche/       # Onboarding organisations
│   ├── dashboard/                  # Dashboard organisation
│   └── admin/                      # Interface admin
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CarteFormation.tsx
│   ├── EtoilesNote.tsx
│   ├── BadgeCPF.tsx
│   ├── FiltresSidebar.tsx
│   ├── MoteurMatching.tsx
│   ├── FormulaireAvis.tsx
│   ├── FormulaireRevendication.tsx
│   ├── AdminAvis.tsx
│   └── AdminFormations.tsx
└── lib/
    ├── supabase/
    │   ├── server.ts               # Client Supabase côté serveur
    │   └── client.ts               # Client Supabase côté client
    └── types/
        └── database.ts             # Types TypeScript
```

## SEO

- Schema.org `Course`, `AggregateRating`, `ItemList`, `FAQPage` sur les pages pertinentes
- Meta descriptions optimisées avec chiffres
- Sitemap XML dynamique
- Open Graph configuré
- H1 SEO-friendly sur chaque page catégorie

## Catégories disponibles

Copywriting, Marketing Digital, E-commerce, Closing, Freelance, SEO, Community Management, Montage Vidéo, Dropshipping, Trading
