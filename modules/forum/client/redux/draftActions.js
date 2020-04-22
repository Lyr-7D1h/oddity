export const FETCH_DRAFTS = "draft:fetchDrafts";
export const UPDATE_DRAFTS = "draft:updateDrafts";

export const fetchDrafts = () => {
  return {
    type: FETCH_DRAFTS,
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
