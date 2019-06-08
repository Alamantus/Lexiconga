import { DISMISSED_ANNOUNCEMENTS_KEY } from "../constants";
import { fadeOutElement } from "./utilities";

export function getDismissed() {
  let dismissed = window.localStorage.getItem(DISMISSED_ANNOUNCEMENTS_KEY);
  if (!dismissed) {
    dismissed = [];
  } else {
    dismissed = JSON.parse(dismissed);
  }
  return dismissed;
}

export function dismiss(announcement) {
  if (announcement.id) {
    const dismissed = getDismissed();
    dismissed.push(announcement.id);
    window.localStorage.setItem(DISMISSED_ANNOUNCEMENTS_KEY, JSON.stringify(dismissed));
  }
  fadeOutElement(announcement)
}
