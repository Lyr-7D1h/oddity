import requester from "Helpers/requester";
import { UPDATE_DRAFTS, PUSH_DRAFT } from "./forumActions";

export default (_state, { type, payload }) => {
  switch (type) {
    case UPDATE_DRAFTS:
      return { drafts: payload.drafts };
    case PUSH_DRAFT:
      const drafts = state.drafts;
      drafts.push(payload.draft);
      return { drafts };
    default:
      return { drafts: [] };
  }
};
