import { UPDATE_DRAFTS, FETCH_DRAFTS } from "./draftActions";

export default (
  state = { drafts: [], draftCount: null },
  { type, payload }
) => {
  switch (type) {
    case UPDATE_DRAFTS:
      return { drafts: payload.drafts, draftCount: payload.drafts.length };
    case FETCH_DRAFTS:
      return { drafts: state.drafts, draftCount: 0 };
    default:
      return state;
  }
};
