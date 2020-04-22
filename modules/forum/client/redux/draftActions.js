export const PUSH_DRAFT = "draft:pushDraft";
export const UPDATE_DRAFTS = "draft:updateDrafts";

export const pushDraft = (draft) => {
  return {
    type: PUSH_DRAFT,
    payload: {
      draft,
    },
  };
};

export const updateDrafts = (drafts) => {
  return {
    type: UPDATE_DRAFTS,
    payload: {
      drafts: drafts,
    },
  };
};
