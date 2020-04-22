import { UPDATE_DRAFTS, PUSH_DRAFT } from "./draftActions";

export default (
  state = { drafts: [], draftCount: null },
  { type, payload }
) => {
  switch (type) {
    case UPDATE_DRAFTS:
      return { drafts: payload.drafts, draftCount: payload.drafts.length };
    case PUSH_DRAFT:
      const drafts = state.drafts;
      drafts.push(payload.draft);
      return { drafts, draftCount: drafts.length };
    default:
      return state;
  }
};
