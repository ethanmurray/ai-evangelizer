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

export const sharingAcademic: SharingSlice = {
  microcopy: {
    shareConfirmed: "Knowledge transfer confirmed. This has been recorded in the symposium proceedings.",
    shareDenied: "Transfer declined. You may reconsider and resubmit your decision for peer review.",
    shareInvalidToken: "This citation link is not recognized by the registrar. It may have been retracted.",
    shareStatusChanged: "The record has been amended based on a prior faculty decision.",
  },
};

export const sharingStartup: SharingSlice = {
  microcopy: {
    shareConfirmed: "Boom! Share confirmed. That's traction, baby. Keep the growth flywheel spinning.",
    shareDenied: "No worries — share declined. You can always pivot and change your mind later.",
    shareInvalidToken: "Dead link. This share token is busted or already used. Something broke in the pipeline.",
    shareStatusChanged: "Already iterated on — status was updated from a previous action.",
  },
};

export const sharingScifi: SharingSlice = {
  microcopy: {
    shareConfirmed: "Data transfer confirmed. Neural pathways synchronized. The network expands.",
    shareDenied: "Transfer denied. The interface remains open for re-engagement at your discretion.",
    shareInvalidToken: "ALERT: Unrecognized transmission token. Possible mainframe corruption or interception detected.",
    shareStatusChanged: "Protocol override: status was modified by a prior interface command.",
  },
};

export const sharingRetro: SharingSlice = {
  microcopy: {
    shareConfirmed: "SHARE CONFIRMED. DATA TRANSFER COMPLETE. PRESS ANY KEY TO CONTINUE...",
    shareDenied: "SHARE DECLINED. YOU MAY RETRY AT ANY TIME. LOADING...",
    shareInvalidToken: "ERROR: INVALID TOKEN. FILE NOT FOUND. CHECK DISK AND TRY AGAIN.",
    shareStatusChanged: "STATUS ALREADY UPDATED FROM PREVIOUS INPUT. SYSTEM ONLINE.",
  },
};

export const sharingNerdy: SharingSlice = {
  microcopy: {
    shareConfirmed: "Loot shared successfully! Your party member received the knowledge scroll. +50 XP for generosity!",
    shareDenied: "Share declined. The quest item remains in your inventory. You can trade it later.",
    shareInvalidToken: "That share link is a mimic! It's invalid or already been looted. Roll for investigation.",
    shareStatusChanged: "A previous save file already modified this quest status. The timeline has shifted.",
  },
};

export const sharingConsulting: SharingSlice = {
  microcopy: {
    shareConfirmed: "Share validated. This cross-functional knowledge transfer has been logged and will be leveraged to move the needle on our engagement metrics.",
    shareDenied: "Share deprioritized. No action items generated. You can circle back and re-engage at any point in the pipeline.",
    shareInvalidToken: "This share token has failed our validation framework. It may have been sunsetted or already actioned by a prior stakeholder.",
    shareStatusChanged: "Status already updated per a previous stakeholder decision. Let's take this offline if further alignment is needed.",
  },
};
