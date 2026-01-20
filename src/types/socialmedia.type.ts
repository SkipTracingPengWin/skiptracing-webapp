// types/social-profilesthth
export interface SocialPlatform {
  id: number;
  name: string;
  icon: string;
  count: number;
}

export interface SocialProfile {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  platforms: SocialPlatform[];
}

export interface SocialMediaSearchResult {
  position: number;
  title: string;
  link: string;
  redirect_link: string;
  displayed_link: string;
  favicon: string;
  snippet: string;
  snippet_highlighted_words: string[];
  source: string;
  platform: string;
  url: string;
}

export interface SocialMediaSearchResponse {
  success: boolean;
  count: number;
  data: SocialMediaSearchResult[];
}

export interface SocialProfilesState {
  profiles: SocialProfile[];
  loading: boolean;
  selectedProfileId: string | null;
  searchResults: Record<string, SocialMediaSearchResult[]>; // borrowerId -> results
  selectedBorrowerIds: string[];
  selectedAccounts: Record<string, SocialMediaSearchResult[]>; // borrowerId -> selected accounts
  setProfiles: (profiles: SocialProfile[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedProfile: (id: string | null) => void;
  performSearch: (borrowerId: string, name: string) => Promise<void>;
  addSelectedBorrower: (id: string) => void;
  removeSelectedBorrower: (id: string) => void;
  deleteBorrower: (id: string) => void;
  setSelectedAccounts: (borrowerId: string, accounts: SocialMediaSearchResult[]) => void;
}
