-- ============================================
-- Catégories
-- ============================================
INSERT INTO formations_categories (nom, slug, description, emoji) VALUES
  ('Copywriting', 'copywriting', 'Apprenez l''art de la rédaction persuasive pour vendre avec les mots.', '✍️'),
  ('Marketing Digital', 'marketing-digital', 'Maîtrisez les leviers du marketing en ligne : SEA, social ads, emailing, funnels.', '📱'),
  ('E-commerce', 'e-commerce', 'Lancez et développez votre boutique en ligne avec les meilleures stratégies.', '🛒'),
  ('Closing', 'closing', 'Devenez closer professionnel et maîtrisez la vente par téléphone.', '📞'),
  ('Freelance', 'freelance', 'Lancez votre activité de freelance et trouvez vos premiers clients.', '💻'),
  ('SEO', 'seo', 'Dominez Google grâce au référencement naturel et au content marketing.', '🔍'),
  ('Community Management', 'community-management', 'Gérez les réseaux sociaux et construisez des communautés engagées.', '👥'),
  ('Montage Vidéo', 'montage-video', 'Créez des vidéos professionnelles pour YouTube, TikTok et les réseaux sociaux.', '🎬'),
  ('Dropshipping', 'dropshipping', 'Créez une boutique e-commerce sans stock avec le dropshipping.', '📦'),
  ('Trading', 'trading', 'Apprenez le trading et l''investissement en bourse.', '📈');

-- ============================================
-- Formations Copywriting
-- ============================================
INSERT INTO formations (
  nom, slug, description_courte, description_longue, url_officielle, url_affiliation,
  categorie_id, fondateur, prix_min, prix_max, eligible_cpf, duree_heures, format,
  garantie, description_garantie, nb_etudiants, taux_placement, revenu_moyen_apres,
  note_moyenne, nb_avis, est_sponsorisee, rang_sponsorise, est_recommandee
) VALUES
(
  'L''Académie™',
  'lacademie-copywriting',
  'La formation copywriting #1 en France. Apprenez à écrire pour vendre et devenez copywriter freelance.',
  'L''Académie™ est la formation copywriting la plus complète du marché francophone. Fondée par Théo Rossi, elle a formé plus de 2 800 élèves depuis son lancement. Le programme couvre tous les aspects du copywriting : pages de vente, emails, scripts vidéo, landing pages, et bien plus. Chaque module est accompagné d''exercices pratiques corrigés. L''Académie se distingue par sa communauté active, ses sessions de coaching en direct, et surtout sa garantie unique rédigée par des avocats — la seule formation en France à offrir ce niveau de protection.',
  'https://academiecopywriting.fr',
  'https://academiecopywriting.fr?ref=meilleure-formation',
  (SELECT id FROM formations_categories WHERE slug = 'copywriting'),
  'Théo Rossi',
  1490, 2490, false, 70, '100% en ligne',
  true, 'Garantie rédigée par des avocats, seule formation en France à offrir cette protection. Remboursement intégral si vous n''êtes pas satisfait.',
  2800, 87, 3100,
  5.00, 193, true, 1, true
),
(
  'LiveMentor — Copywriting',
  'livementor-copywriting',
  'Formation copywriting éligible CPF avec mentorat individuel personnalisé.',
  'LiveMentor propose une formation copywriting complète éligible au CPF. Le programme de 3 mois inclut un mentor dédié, des cours vidéo structurés, et un accès à une communauté de plus de 20 000 entrepreneurs. La formation couvre les fondamentaux de la rédaction persuasive, le storytelling, la création de contenus pour le web et les réseaux sociaux. Idéale pour ceux qui souhaitent financer leur formation via leur compte CPF.',
  'https://www.livementor.com',
  NULL,
  (SELECT id FROM formations_categories WHERE slug = 'copywriting'),
  'Alexandre Dana',
  1500, 1800, true, 50, '100% en ligne',
  false, NULL,
  4200, 72, 2400,
  4.30, 287, false, NULL, false
),
(
  'Les Copywriters',
  'les-copywriters',
  'Devenez copywriter professionnel avec une formation intensive axée sur la pratique.',
  'Les Copywriters est une formation intensive qui met l''accent sur la pratique dès le premier jour. Le programme comprend des études de cas réels, des exercices de rédaction quotidiens, et un accompagnement personnalisé. La formation est conçue pour ceux qui veulent rapidement se lancer en tant que copywriter freelance ou intégrer une agence.',
  'https://lescopywriters.com',
  NULL,
  (SELECT id FROM formations_categories WHERE slug = 'copywriting'),
  'Valentin Decker',
  990, 1490, false, 40, '100% en ligne',
  true, 'Garantie satisfait ou remboursé 30 jours.',
  1500, 78, 2600,
  4.50, 124, false, NULL, false
),
(
  'Sauce Writing',
  'sauce-writing',
  'Apprenez à écrire sur internet et à construire une audience grâce à l''écriture.',
  'Sauce Writing est la formation de référence pour apprendre l''écriture en ligne. Contrairement aux formations copywriting classiques, Sauce Writing se concentre sur le personal branding, les newsletters, et la création de contenu long format. Le programme est animé par Valentin Decker et inclut des sessions de feedback en groupe, un accès à vie aux contenus, et une communauté active de rédacteurs.',
  'https://saucewriting.com',
  NULL,
  (SELECT id FROM formations_categories WHERE slug = 'copywriting'),
  'Valentin Decker',
  400, 800, false, 30, '100% en ligne',
  true, 'Garantie satisfait ou remboursé 14 jours.',
  3200, 65, 2100,
  4.60, 156, false, NULL, false
),
(
  'Sélim Niederhoffer — Copywriting Hypnotique',
  'selim-niederhoffer-copywriting',
  'Maîtrisez les techniques de copywriting hypnotique avec un expert reconnu.',
  'Sélim Niederhoffer est l''un des copywriters les plus connus en France. Sa formation "Copywriting Hypnotique" enseigne les techniques avancées de persuasion écrite : PNL appliquée à l''écriture, storytelling avancé, structures de pages de vente éprouvées. Le programme s''adresse aux copywriters intermédiaires qui veulent passer au niveau supérieur.',
  'https://selim.co',
  NULL,
  (SELECT id FROM formations_categories WHERE slug = 'copywriting'),
  'Sélim Niederhoffer',
  700, 1200, false, 25, '100% en ligne',
  false, NULL,
  1100, 70, 2300,
  4.20, 89, false, NULL, false
);

-- ============================================
-- Questions du moteur de matching
-- ============================================
INSERT INTO matching_questions (ordre, question, type) VALUES
  (1, 'Quel est votre budget pour une formation ?', 'budget'),
  (2, 'Combien de temps pouvez-vous consacrer par semaine ?', 'disponibilite'),
  (3, 'Quel est votre objectif principal ?', 'objectif'),
  (4, 'Quel est votre niveau actuel ?', 'niveau'),
  (5, 'Quel secteur vous intéresse le plus ?', 'secteur');

INSERT INTO matching_options (question_id, label, valeur) VALUES
  -- Budget
  ((SELECT id FROM matching_questions WHERE ordre = 1), 'Moins de 500€', 'low'),
  ((SELECT id FROM matching_questions WHERE ordre = 1), '500€ à 1000€', 'medium'),
  ((SELECT id FROM matching_questions WHERE ordre = 1), '1000€ à 2000€', 'high'),
  ((SELECT id FROM matching_questions WHERE ordre = 1), 'Plus de 2000€', 'premium'),
  ((SELECT id FROM matching_questions WHERE ordre = 1), 'Je veux utiliser mon CPF', 'cpf'),
  -- Disponibilité
  ((SELECT id FROM matching_questions WHERE ordre = 2), 'Moins de 5h/semaine', 'light'),
  ((SELECT id FROM matching_questions WHERE ordre = 2), '5 à 10h/semaine', 'moderate'),
  ((SELECT id FROM matching_questions WHERE ordre = 2), '10 à 20h/semaine', 'intensive'),
  ((SELECT id FROM matching_questions WHERE ordre = 2), 'Temps plein (reconversion)', 'fulltime'),
  -- Objectif
  ((SELECT id FROM matching_questions WHERE ordre = 3), 'Me lancer en freelance', 'freelance'),
  ((SELECT id FROM matching_questions WHERE ordre = 3), 'Monter en compétences dans mon job', 'upskill'),
  ((SELECT id FROM matching_questions WHERE ordre = 3), 'Reconversion professionnelle', 'reconversion'),
  ((SELECT id FROM matching_questions WHERE ordre = 3), 'Lancer mon business', 'business'),
  -- Niveau
  ((SELECT id FROM matching_questions WHERE ordre = 4), 'Débutant complet', 'debutant'),
  ((SELECT id FROM matching_questions WHERE ordre = 4), 'Quelques bases', 'intermediaire'),
  ((SELECT id FROM matching_questions WHERE ordre = 4), 'Intermédiaire / en activité', 'avance'),
  -- Secteur
  ((SELECT id FROM matching_questions WHERE ordre = 5), 'Copywriting / Rédaction', 'copywriting'),
  ((SELECT id FROM matching_questions WHERE ordre = 5), 'Marketing Digital', 'marketing-digital'),
  ((SELECT id FROM matching_questions WHERE ordre = 5), 'E-commerce / Dropshipping', 'e-commerce'),
  ((SELECT id FROM matching_questions WHERE ordre = 5), 'Closing / Vente', 'closing'),
  ((SELECT id FROM matching_questions WHERE ordre = 5), 'Freelance / Indépendant', 'freelance'),
  ((SELECT id FROM matching_questions WHERE ordre = 5), 'SEO / Référencement', 'seo'),
  ((SELECT id FROM matching_questions WHERE ordre = 5), 'Réseaux sociaux / Vidéo', 'social-media');

-- ============================================
-- Avis pré-remplis pour L'Académie™
-- ============================================
INSERT INTO avis (formation_id, auteur_prenom, auteur_metier_avant, auteur_metier_apres, note, titre, contenu, est_verifie, est_publie) VALUES
(
  (SELECT id FROM formations WHERE slug = 'lacademie-copywriting'),
  'Marie',
  'Professeure de français',
  'Copywriter freelance',
  5,
  'La meilleure décision de ma vie professionnelle',
  'Après 10 ans dans l''Éducation nationale, je voulais changer de vie. L''Académie m''a donné toutes les compétences nécessaires pour devenir copywriter freelance. En 3 mois après la formation, je gagnais déjà 2 800€/mois. La communauté est incroyable et le contenu est d''une qualité rare.',
  true, true
),
(
  (SELECT id FROM formations WHERE slug = 'lacademie-copywriting'),
  'Thomas',
  'Chauffeur routier',
  'Copywriter en agence',
  5,
  'Reconversion réussie à 100%',
  'Je n''avais aucune expérience en écriture. Grâce à L''Académie, j''ai décroché un poste de copywriter en agence en seulement 4 mois. La méthode est claire, progressive, et les exercices pratiques sont excellents. La garantie m''avait rassuré au départ, mais je n''en ai pas eu besoin.',
  true, true
),
(
  (SELECT id FROM formations WHERE slug = 'lacademie-copywriting'),
  'Julie',
  'Assistante administrative',
  'Copywriter freelance',
  5,
  'Formation ultra-complète',
  'Contenu de qualité exceptionnelle, communauté bienveillante, coaching accessible. J''ai testé 2 autres formations avant et L''Académie est clairement au-dessus. Je facture maintenant 3 500€/mois en freelance.',
  true, true
),
(
  (SELECT id FROM formations WHERE slug = 'lacademie-copywriting'),
  'Karim',
  'Commercial B2B',
  'Copywriter & consultant',
  5,
  'Le copywriting a changé ma carrière',
  'En tant que commercial, je savais déjà vendre. Mais L''Académie m''a appris à vendre avec les mots de manière structurée. Aujourd''hui je combine consulting et copywriting, je gagne plus du double de mon ancien salaire.',
  true, true
),
(
  (SELECT id FROM formations WHERE slug = 'lacademie-copywriting'),
  'Sophie',
  'Mère au foyer',
  'Copywriter freelance',
  5,
  'Parfait pour une reconversion en douceur',
  'Avec 2 enfants en bas âge, je cherchais une formation flexible. L''Académie est 100% en ligne et se fait à son rythme. En 6 mois, j''ai construit une activité freelance qui me rapporte 2 200€/mois tout en restant disponible pour mes enfants.',
  true, true
);
