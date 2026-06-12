export type Page = "dashboard" | "prospects" | "messages" | "settings";

export type ProspectStatus =
  | "new"          // just added
  | "analyzing"    // AI in progress
  | "analyzed"     // score + summary ready
  | "generating"   // message generation in progress
  | "draft"        // message generated, awaiting validation
  | "validated"    // human approved
  | "sent"         // sent manually
  | "rejected"     // human rejected
  | "archived";

export type MessageType = "email" | "dm";
export type MessageTone = "professionnel" | "amical" | "direct" | "chaleureux";

export interface Prospect {
  id: string;
  name: string;
  company?: string;
  role?: string;
  email?: string;
  niche: string;
  notes: string;
  status: ProspectStatus;
  addedAt: string;
  // AI analysis
  aiScore?: number;
  aiSummary?: string;
  aiCategory?: string;
  aiTags?: string[];
  aiAnalyzedAt?: string;
  // Generated message
  generatedMessage?: string;
  messageType?: MessageType;
  messageTone?: MessageTone;
  messageGeneratedAt?: string;
  messageValidatedAt?: string;
}

export interface AISettings {
  ollamaEndpoint: string;
  model: string;
  defaultTone: MessageTone;
  defaultMessageType: MessageType;
  maxTokens: number;
  temperature: number;
}

// Kept for unused Figma Make showcase components.
export type NetworkId = "instagram" | "tiktok" | "linkedin" | "twitter" | "youtube";
