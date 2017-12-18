export interface Conference {
  name: string;
  location: string[];
  date: Date|string;
  confDays: number;
  // TODO: workshopDays
  website: string;
  price?: number;
  priceCurrency?: string;
  confSize?: number;
  description: string[];
  speakers: string[];
  tags: string[];
  twitterHandle?: string; // TODO: hash tags
}
