// store/social-profiles-store
"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SocialProfilesState, SocialProfile } from '@/types/socialmedia.type';
import { socialMediaService } from '@/services/socialmedia.services';

const initialProfiles: SocialProfile[] = [];

export const useSocialProfilesStore = create<SocialProfilesState>()(
  persist(
    (set, get) => ({
      profiles: initialProfiles,
      loading: false,
      selectedProfileId: null,
      searchResults: {},
      selectedBorrowerIds: [],
      selectedAccounts: {},
      setProfiles: (profiles) => set({ profiles }),
      setLoading: (loading) => set({ loading }),
      setSelectedProfile: (id) => set({ selectedProfileId: id }),
      performSearch: async (borrowerId: string, name: string) => {
        set({ loading: true });
        try {
          const response = await socialMediaService.searchSocialMedia(borrowerId, name);
          if (response.success) {
            set((state) => ({
              searchResults: {
                ...state.searchResults,
                [borrowerId]: response.data
              }
            }));
          }
        } catch (error: any) {
          console.error(`❌ Search failed for borrower ${borrowerId}:`, error.message);
        } finally {
          set({ loading: false });
        }
      },
      addSelectedBorrower: (id: string) => set((state) => {
        if (!state.selectedBorrowerIds.includes(id)) {
          return { selectedBorrowerIds: [...state.selectedBorrowerIds, id] };
        }
        return state;
      }),
      removeSelectedBorrower: (id: string) => set((state) => ({
        selectedBorrowerIds: state.selectedBorrowerIds.filter(bid => bid !== id)
      })),
      deleteBorrower: (id: string) => {
        // Remove borrower ID from selected list
        get().removeSelectedBorrower(id);

        // Clear search results for this borrower
        set((state) => {
          const newSearchResults = { ...state.searchResults };
          delete newSearchResults[id];

          // Clear selected accounts for this borrower
          const newSelectedAccounts = { ...state.selectedAccounts };
          delete newSelectedAccounts[id];

          return {
            searchResults: newSearchResults,
            selectedAccounts: newSelectedAccounts
          };
        });
      },
      setSelectedAccounts: (borrowerId: string, accounts: any[]) => set((state) => ({
        selectedAccounts: {
          ...state.selectedAccounts,
          [borrowerId]: accounts
        }
      }))
    }),
    {
      name: 'social-profiles-storage'
    }
  )
);

