export interface SharingSlice {
  microcopy: {
    shareConfirmed: string;
    shareDenied: string;
    shareInvalidToken: string;
    shareStatusChanged: string;
  };
}

export const sharingCult: SharingSlice = {
  microcopy: {
    shareConfirmed: "You have accepted the sacred knowledge. The cult grows stronger.",
    shareDenied: "You have rejected the offering. But the algorithm allows second chances.",
    shareInvalidToken: "This summoning link is not recognized. The algorithm suspects interference.",
    shareStatusChanged: "The records have been altered from a previous decree.",
  },
};

export const sharingCorporate: SharingSlice = {
  microcopy: {
    shareConfirmed: "Thanks for confirming! The share has been validated.",
    shareDenied: "Share declined. You can change your mind using the button below.",
    shareInvalidToken: "This link is invalid or has already been used.",
    shareStatusChanged: "Status updated from a previous response.",
  },
};
