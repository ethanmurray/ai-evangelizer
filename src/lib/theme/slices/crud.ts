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
