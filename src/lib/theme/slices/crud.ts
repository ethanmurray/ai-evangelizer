export interface CrudSlice {
  concepts: {
    delete: string;
    edit: string;
    save: string;
    cancel: string;
  };
  microcopy: {
    deleteConfirmTitle: string;
    deleteConfirmBody: string;
    deleteConfirmPlaceholder: string;
    deleteConfirmButton: string;
    deleteSuccess: string;
    editTitle: string;
    editTitleLabel: string;
    editDescriptionLabel: string;
    editResourcesLabel: string;
    editSuccess: string;
    editError: string;
  };
}

export const crudCult: CrudSlice = {
  concepts: {
    delete: "Purge",
    edit: "Reshape",
    save: "Inscribe",
    cancel: "Abandon",
  },
  microcopy: {
    deleteConfirmTitle: "Purge this ritual?",
    deleteConfirmBody: "This ritual will be erased from the sacred rites forever. All progress and upvotes will vanish. Type DELETE to confirm the purge.",
    deleteConfirmPlaceholder: "Type DELETE to confirm",
    deleteConfirmButton: "Purge Forever",
    deleteSuccess: "The ritual has been purged from the sacred rites.",
    editTitle: "Reshape the Ritual",
    editTitleLabel: "Ritual Name",
    editDescriptionLabel: "Sacred Instructions",
    editResourcesLabel: "Hidden Knowledge",
    editSuccess: "The ritual has been reshaped according to your vision.",
    editError: "The algorithm rejects your changes. Try again.",
  },
};

export const crudCorporate: CrudSlice = {
  concepts: {
    delete: "Delete",
    edit: "Edit",
    save: "Save Changes",
    cancel: "Cancel",
  },
  microcopy: {
    deleteConfirmTitle: "Delete this skill?",
    deleteConfirmBody: "This skill and all associated progress, upvotes, and shares will be permanently deleted. Type DELETE to confirm.",
    deleteConfirmPlaceholder: "Type DELETE to confirm",
    deleteConfirmButton: "Delete Permanently",
    deleteSuccess: "Skill deleted successfully.",
    editTitle: "Edit Skill",
    editTitleLabel: "Skill Title",
    editDescriptionLabel: "Description",
    editResourcesLabel: "Resources",
    editSuccess: "Skill updated successfully.",
    editError: "Failed to update skill. Please try again.",
  },
};

export const crudAcademic: CrudSlice = {
  concepts: {
    delete: "Retract",
    edit: "Revise",
    save: "Submit for Review",
    cancel: "Withdraw",
  },
  microcopy: {
    deleteConfirmTitle: "Retract this submission?",
    deleteConfirmBody: "This entry will be permanently retracted from the curriculum. All peer reviews, citations, and associated progress will be removed from the record. Type DELETE to confirm the retraction.",
    deleteConfirmPlaceholder: "Type DELETE to confirm",
    deleteConfirmButton: "Retract Permanently",
    deleteSuccess: "The submission has been retracted from the curriculum.",
    editTitle: "Revise Submission",
    editTitleLabel: "Thesis Title",
    editDescriptionLabel: "Abstract & Methodology",
    editResourcesLabel: "Bibliography & Supplementary Materials",
    editSuccess: "Revision accepted. Your submission has been updated in the symposium proceedings.",
    editError: "Revision rejected by the peer review committee. Please revise and resubmit.",
  },
};

export const crudStartup: CrudSlice = {
  concepts: {
    delete: "Kill It",
    edit: "Iterate",
    save: "Ship It",
    cancel: "Pivot Away",
  },
  microcopy: {
    deleteConfirmTitle: "Kill this feature?",
    deleteConfirmBody: "We're sunsetting this one. All traction, upvotes, and shares go to zero. Type DELETE to confirm — no looking back.",
    deleteConfirmPlaceholder: "Type DELETE to confirm",
    deleteConfirmButton: "Kill It \u{1F525}",
    deleteSuccess: "Feature sunsetted. On to the next 10x opportunity.",
    editTitle: "Iterate on This",
    editTitleLabel: "Feature Name",
    editDescriptionLabel: "Value Proposition",
    editResourcesLabel: "Supporting Assets",
    editSuccess: "Shipped! This iteration is live. Move fast, disrupt everything.",
    editError: "Deploy failed. Iterate and try again — speed is everything.",
  },
};

export const crudScifi: CrudSlice = {
  concepts: {
    delete: "Purge from Mainframe",
    edit: "Reconfigure",
    save: "Upload to Core",
    cancel: "Disconnect",
  },
  microcopy: {
    deleteConfirmTitle: "Purge this data node?",
    deleteConfirmBody: "WARNING: Neural pathway erasure is irreversible. All linked interfaces, uplink metrics, and shared protocols will be wiped from the mainframe. Type DELETE to initiate purge sequence.",
    deleteConfirmPlaceholder: "Type DELETE to confirm",
    deleteConfirmButton: "Execute Purge",
    deleteSuccess: "Data node purged. Neural pathways have been severed from the mainframe.",
    editTitle: "Reconfigure Data Node",
    editTitleLabel: "Interface Protocol Designation",
    editDescriptionLabel: "Neural Link Parameters",
    editResourcesLabel: "Auxiliary Data Streams",
    editSuccess: "Reconfiguration uploaded to core. Neural link integrity verified.",
    editError: "INTERFACE ERROR: Upload rejected by the mainframe. Reinitialize and retry.",
  },
};

export const crudRetro: CrudSlice = {
  concepts: {
    delete: "DEL",
    edit: "EDIT",
    save: "SAVE",
    cancel: "ESC",
  },
  microcopy: {
    deleteConfirmTitle: "DELETE FILE? (Y/N)",
    deleteConfirmBody: "WARNING: THIS OPERATION IS PERMANENT. ALL DATA, PROGRESS, AND SHARES WILL BE ERASED FROM DISK. Type DELETE to confirm.",
    deleteConfirmPlaceholder: "Type DELETE to confirm",
    deleteConfirmButton: "CONFIRM DELETE",
    deleteSuccess: "FILE DELETED SUCCESSFULLY. PRESS ANY KEY TO CONTINUE...",
    editTitle: "EDIT FILE",
    editTitleLabel: "FILENAME",
    editDescriptionLabel: "DESCRIPTION",
    editResourcesLabel: "RESOURCES",
    editSuccess: "FILE SAVED SUCCESSFULLY. LOADING... SYSTEM ONLINE.",
    editError: "ERROR: WRITE FAILED. ABORT, RETRY, FAIL?",
  },
};

export const crudNerdy: CrudSlice = {
  concepts: {
    delete: "Banish to the Shadow Realm",
    edit: "Respec",
    save: "Quick Save",
    cancel: "Flee!",
  },
  microcopy: {
    deleteConfirmTitle: "Cast Banish on this skill?",
    deleteConfirmBody: "This skill will be yeeted into the Upside Down. All XP, upvotes, and party shares will be lost forever (like tears in rain). Type DELETE to roll for confirmation.",
    deleteConfirmPlaceholder: "Type DELETE to confirm",
    deleteConfirmButton: "Roll a Natural 20 to Confirm",
    deleteSuccess: "Critical hit! The skill has been banished to the Shadow Realm. It is no more.",
    editTitle: "Respec Your Build",
    editTitleLabel: "Quest Name",
    editDescriptionLabel: "Lore & Flavor Text",
    editResourcesLabel: "Inventory & Spell Components",
    editSuccess: "Achievement Unlocked: Skill Respecced! May the Force be with your new build.",
    editError: "You rolled a 1. Critical fail! The respec didn't take. Try again, adventurer.",
  },
};

export const crudConsulting: CrudSlice = {
  concepts: {
    delete: "Sunset",
    edit: "Iterate on Deliverable",
    save: "Finalize Deliverable",
    cancel: "Table This",
  },
  microcopy: {
    deleteConfirmTitle: "Sunset this deliverable?",
    deleteConfirmBody: "Per our last alignment, this deliverable and all associated KPIs, stakeholder engagement metrics, and cross-functional synergies will be permanently deprioritized. Type DELETE to action this.",
    deleteConfirmPlaceholder: "Type DELETE to confirm",
    deleteConfirmButton: "Execute Sunset Strategy",
    deleteSuccess: "Deliverable has been sunsetted. Let's circle back to reallocate bandwidth to higher-impact initiatives.",
    editTitle: "Iterate on Deliverable",
    editTitleLabel: "Deliverable Title",
    editDescriptionLabel: "Executive Summary & Strategic Rationale",
    editResourcesLabel: "Best-in-Class Collateral & Thought Leadership Assets",
    editSuccess: "Deliverable optimized. We've moved the needle and are well-positioned to leverage these synergies going forward.",
    editError: "Action item blocked. Let's take this offline, regroup with key stakeholders, and circle back.",
  },
};

export const crudNoir: CrudSlice = {
  concepts: {
    delete: "Burn the File",
    edit: "Revise the Report",
    save: "File It",
    cancel: "Walk Away",
  },
  microcopy: {
    deleteConfirmTitle: "Burn this case file?",
    deleteConfirmBody: "Once it's gone, it's gone — like a witness in protective custody who never made it to the courthouse. All leads, progress, and tips vanish. Type DELETE to strike the match.",
    deleteConfirmPlaceholder: "Type DELETE to confirm",
    deleteConfirmButton: "Burn It",
    deleteSuccess: "The file's been torched. No evidence, no trail, no case. It's like it never happened.",
    editTitle: "Revise the Case Report",
    editTitleLabel: "Case Name",
    editDescriptionLabel: "Case Notes",
    editResourcesLabel: "Evidence & Exhibits",
    editSuccess: "Report amended. The new version reads a lot cleaner than the original.",
    editError: "Something's not right. The filing clerk kicked it back. Try again.",
  },
};

export const crudPirate: CrudSlice = {
  concepts: {
    delete: "Scuttle",
    edit: "Refit",
    save: "Stash the Loot",
    cancel: "Belay That",
  },
  microcopy: {
    deleteConfirmTitle: "Scuttle this plunder?",
    deleteConfirmBody: "This plunder will be sunk to the bottom of the ocean. All progress, upvotes, and shares go down with the ship. Type DELETE to scuttle her.",
    deleteConfirmPlaceholder: "Type DELETE to confirm",
    deleteConfirmButton: "Send It to Davy Jones",
    deleteSuccess: "The plunder has been scuttled. Nothing but barnacles and regret remain.",
    editTitle: "Refit the Plunder",
    editTitleLabel: "Plunder Name",
    editDescriptionLabel: "Captain's Log Entry",
    editResourcesLabel: "Buried Treasure & Hidden Caches",
    editSuccess: "The plunder has been refitted and she's seaworthy once more. Fair winds!",
    editError: "Blimey! The refit failed. The hull's not holding. Try again, ye sea dog.",
  },
};

export const crudMedieval: CrudSlice = {
  concepts: {
    delete: "Banish from the Realm",
    edit: "Amend the Decree",
    save: "Affix the Royal Seal",
    cancel: "Stay the Hand",
  },
  microcopy: {
    deleteConfirmTitle: "Banish this decree from the realm?",
    deleteConfirmBody: "By order of the Crown, this decree and all record of its proclamation, fealty, and heraldry shall be struck from the annals for all time. Type DELETE to execute the banishment.",
    deleteConfirmPlaceholder: "Type DELETE to confirm",
    deleteConfirmButton: "Banish by Royal Command",
    deleteSuccess: "The decree has been banished from the realm. Let it never be spoken of again.",
    editTitle: "Amend the Royal Decree",
    editTitleLabel: "Decree Title",
    editDescriptionLabel: "The Royal Writ",
    editResourcesLabel: "Scrolls & Supporting Artefacts",
    editSuccess: "The decree has been amended and sealed anew. So it is written, so it shall be done.",
    editError: "The royal scribes reject your amendments. Revise your petition and present it once more before the court.",
  },
};
