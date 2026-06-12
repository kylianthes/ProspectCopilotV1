import type { Prospect, AISettings, MessageTone } from "./types";

export const MOCK_PROSPECTS: Prospect[] = [
  {
    id: "p1", name: "Léa Fontaine", company: "Investissements LF", role: "Fondatrice",
    email: "lea@investissementslf.fr", linkedin: "linkedin.com/in/leafontaine",
    niche: "Finance personnelle", notes: "Très active sur LinkedIn, poste 3x/semaine sur l'épargne.",
    status: "analyzed", addedAt: "2026-06-08T10:00:00Z",
    aiScore: 94, aiCategory: "Partenaire stratégique",
    aiSummary: "Fondatrice d'une structure de conseil en finance personnelle avec une audience engagée. Fort potentiel d'alignement produit — son audience cible est exactement celle que Prospect Copilot sert.",
    aiTags: ["Finance", "B2C", "Audience engagée", "Haute priorité"],
    aiAnalyzedAt: "2026-06-08T10:15:00Z",
  },
  {
    id: "p2", name: "Thomas Blanc", company: "Blanc Capital Partners", role: "Analyste financier senior",
    email: "t.blanc@blanccapital.com", linkedin: "linkedin.com/in/thomasblanc",
    niche: "Finance / VC", notes: "Conférencier récurrent sur les levées de fonds early-stage.",
    status: "draft", addedAt: "2026-06-07T09:00:00Z",
    aiScore: 91, aiCategory: "Prescripteur B2B",
    aiSummary: "Profil VC avec réseau dense dans l'écosystème startup. Peut agir comme prescripteur auprès de ses LP et fondateurs de portefeuille.",
    aiTags: ["VC", "B2B", "Réseau dense", "Haute priorité"],
    aiAnalyzedAt: "2026-06-07T09:20:00Z",
    generatedMessage: "Bonjour Thomas,\n\nJ'ai suivi votre analyse sur les levées early-stage — votre approche sur la qualification des leads est exactement le problème que Prospect Copilot résout.\n\nNous automatisons l'analyse IA + scoring de prospects pour permettre aux commerciaux de se concentrer sur les conversations qui comptent vraiment.\n\nSeriez-vous disponible pour un échange de 20 minutes cette semaine ?",
    messageType: "email", messageTone: "professionnel",
    messageGeneratedAt: "2026-06-07T09:35:00Z",
  },
  {
    id: "p3", name: "Maxime Girard", company: "GrowthStack", role: "CEO",
    email: "maxime@growthstack.io", linkedin: "linkedin.com/in/maximegirard",
    niche: "SaaS / Growth", notes: "Scale-up en phase de commercialisation, équipe sales de 5.",
    status: "validated", addedAt: "2026-06-06T14:00:00Z",
    aiScore: 87, aiCategory: "Client cible direct",
    aiSummary: "CEO d'une scale-up avec une équipe sales en croissance. Pain-point évident sur la qualification de leads — budget décisionnel direct.",
    aiTags: ["SaaS", "Scale-up", "Décideur", "Sales team"],
    aiAnalyzedAt: "2026-06-06T14:18:00Z",
    generatedMessage: "Salut Maxime,\n\nAvec une équipe sales de 5 et la phase de commercialisation chez GrowthStack, je parie que la qualification manuelle de leads vous coûte un temps fou.\n\nProspect Copilot analyse et score automatiquement vos prospects (IA locale, aucune data vers le cloud) + génère des messages personnalisés prêts à envoyer.\n\nTu aurais 15 min pour une démo live ?",
    messageType: "dm", messageTone: "direct",
    messageGeneratedAt: "2026-06-06T14:45:00Z", messageValidatedAt: "2026-06-06T16:00:00Z",
  },
  {
    id: "p4", name: "Inès Bouchard", company: "MKT Agency", role: "Growth Hacker",
    email: "ines@mktagency.fr", linkedin: "linkedin.com/in/inesbouchard",
    niche: "Marketing digital", notes: "Agence avec 12 clients actifs, cherche à automatiser la prospection.",
    status: "sent", addedAt: "2026-06-05T11:00:00Z",
    aiScore: 76, aiCategory: "Partenaire revendeur",
    aiSummary: "Growth hacker en agence avec un besoin concret d'automatisation. Opportunité de partenariat revendeur potentiel.",
    aiTags: ["Marketing", "Agence", "Revendeur potentiel"],
    aiAnalyzedAt: "2026-06-05T11:12:00Z",
    generatedMessage: "Bonjour Inès,\n\nEn agence avec 12 clients actifs, la prospection manuelle prend facilement 30% du temps de votre équipe.\n\nProspect Copilot pourrait vous permettre de proposer un service de prospection IA à vos clients — scoring automatique, messages personnalisés, validation humaine avant envoi.\n\nOn peut en parler rapidement ?",
    messageType: "email", messageTone: "professionnel",
    messageGeneratedAt: "2026-06-05T11:30:00Z", messageValidatedAt: "2026-06-05T15:00:00Z",
  },
  {
    id: "p5", name: "Hugo Renault", company: "Renault Consulting", role: "Coach Business",
    email: "hugo@renaultconsulting.fr", linkedin: "linkedin.com/in/hugorenault",
    niche: "Coaching / Business", notes: "A mentionné sur LinkedIn chercher des outils IA pour son activité de coaching.",
    status: "new", addedAt: "2026-06-10T08:30:00Z",
  },
  {
    id: "p6", name: "Sofia Karim", company: "Beauté Naturelle Co.", role: "Directrice Marketing",
    email: "sofia@beautenaturelle.co", linkedin: "",
    niche: "Beauté / E-commerce", notes: "Lancement d'une nouvelle ligne de produits en septembre.",
    status: "rejected", addedAt: "2026-06-04T09:00:00Z",
    aiScore: 48, aiCategory: "Hors cible",
    aiSummary: "Profil B2C dans la beauté. Faible alignement avec notre ICP — pas de besoin de prospection outbound identifié.",
    aiTags: ["Beauté", "B2C", "Faible priorité"],
    aiAnalyzedAt: "2026-06-04T09:10:00Z",
  },
  {
    id: "p7", name: "Antoine Moreau", company: "CryptoFlow", role: "Fondateur",
    email: "antoine@cryptoflow.io", linkedin: "linkedin.com/in/antoinemoreau",
    niche: "Crypto / Fintech", notes: "Cherche à développer sa base d'utilisateurs. Audience très engagée.",
    status: "new", addedAt: "2026-06-10T09:00:00Z",
  },
  {
    id: "p8", name: "Claire Dupont", company: "HRTech Solutions", role: "Head of Sales",
    email: "c.dupont@hrtech.fr", linkedin: "linkedin.com/in/clairedupont",
    niche: "RH / SaaS", notes: "Équipe de 8 commerciaux, recherche activement des outils d'optimisation.",
    status: "new", addedAt: "2026-06-09T16:00:00Z",
  },
];

export const DEFAULT_AI_SETTINGS: AISettings = {
  userName: "",
  ollamaEndpoint: "http://localhost:11434",
  model: "qwen2.5:1.5b",
  defaultTone: "professionnel",
  defaultMessageType: "email",
  maxTokens: 512,
  temperature: 0.7,
};

export const AI_ANALYSIS_POOL = [
  { aiScore: 88, aiCategory: "Client cible direct", aiSummary: "Profil très aligné avec notre ICP. Décideur avec budget, pain-point clairement identifié sur la qualification de leads.", aiTags: ["Décideur", "Budget confirmé", "Haute priorité"] },
  { aiScore: 72, aiCategory: "Prospect standard", aiSummary: "Correspondance modérée avec l'ICP. Des opportunités d'engagement existent mais nécessitent une approche personnalisée.", aiTags: ["À qualifier", "Score moyen"] },
  { aiScore: 95, aiCategory: "Partenaire stratégique", aiSummary: "Profil exceptionnel. Forte influence dans son secteur, potentiel de prescription élevé et alignement parfait avec la proposition de valeur.", aiTags: ["Influenceur sectoriel", "Priorité absolue", "Top 5%"] },
  { aiScore: 61, aiCategory: "Prospect froid", aiSummary: "Alignement partiel. Le besoin existe probablement mais n'est pas encore exprimé. Nécessite une approche éducative.", aiTags: ["Nurturing requis", "Moyen terme"] },
];

export const MESSAGE_TEMPLATES: Record<MessageTone, string> = {
  professionnel: `Bonjour {name},

J'ai analysé votre profil et votre activité dans le secteur {niche} — votre approche m'a particulièrement intéressé(e).

Je développe Prospect Copilot, un copilote IA qui automatise l'analyse et le scoring de prospects tout en gardant l'humain dans la boucle pour chaque envoi.

Seriez-vous disponible pour un échange de 20 minutes cette semaine ?

Cordialement`,

  amical: `Salut {name} 👋

J'ai vu ton travail dans la niche {niche} et franchement c'est vraiment intéressant !

Je développe un outil IA pour la prospection qui te ferait probablement gagner un temps fou — analyse automatique, scoring, messages personnalisés.

Tu serais dispo pour qu'on en discute rapidement ?`,

  direct: `{name},

Ton profil correspond à notre ICP — secteur {niche}, décideur, besoin de prospection structurée.

Prospect Copilot : scoring IA + génération de messages. Résultat : 3x moins de temps sur la qualification, chaque message validé par toi avant envoi.

15 min cette semaine ?`,

  chaleureux: `Bonjour {name},

Je vous écris parce que votre parcours dans {niche} m'a vraiment inspiré(e). Ce que vous construisez a l'air passionnant.

Je travaille sur Prospect Copilot — un copilote IA pour la prospection qui respecte votre façon de travailler, en vous laissant valider chaque message avant envoi.

J'aimerais beaucoup avoir votre avis. On peut s'appeler ?`,
};

// Kept for Design System showcase (NetworkBadge component)
export const NETWORKS = [
  { id: "instagram" as const, label: "Instagram", color: "#E1306C", bgColor: "rgba(225,48,108,0.12)" },
  { id: "tiktok"    as const, label: "TikTok",    color: "#69C9D0", bgColor: "rgba(105,201,208,0.12)" },
  { id: "linkedin"  as const, label: "LinkedIn",  color: "#0A66C2", bgColor: "rgba(10,102,194,0.12)" },
  { id: "twitter"   as const, label: "X / Twitter", color: "#E7E9EA", bgColor: "rgba(231,233,234,0.1)" },
  { id: "youtube"   as const, label: "YouTube",   color: "#FF0000", bgColor: "rgba(255,0,0,0.1)" },
];
export const getNetwork = (id: string) => NETWORKS.find(n => n.id === id)!;
