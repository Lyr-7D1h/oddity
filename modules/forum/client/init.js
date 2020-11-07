import requester from "Helpers/requester";
import { updateDrafts } from "./redux/forumActions";

export default (dispatch) =>
  new Promise((res, rej) => {
    requester
      .get("forum/drafts")
      .then((drafts) => {
        dispatch(updateDrafts(drafts));
        res();
      })
      .catch((err) => {
        rej(err);
      });
  });
