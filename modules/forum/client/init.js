import requester from "Helpers/requester";
import { getUser } from "Helpers/userCookie";
import { updateDrafts } from "./redux/forumActions";

export default (dispatch) => {
  if (getUser().id) {
    return new Promise((res, rej) => {
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
  }
};
