import { fadeOutElement } from "./utilities";
import { setCookie, getCookie } from "./StackOverflow/cookie";

export function isDismissed(announcementId) {
  let dismissed = getCookie(announcementId);
  
  return dismissed === 'dismissed';
}

export function dismiss(announcement) {
  if (announcement.id) {
    const expireDate = announcement.dataset.expires;
    const now = new Date();
    const expire = new Date(expireDate);
    const timeDiff = Math.abs(now.getTime() - expire.getTime());
    const dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
    setCookie(announcement.id, 'dismissed', dayDifference + 1);
  }
  fadeOutElement(announcement)
}
