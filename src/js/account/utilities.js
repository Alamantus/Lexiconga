import { setCookie } from "../StackOverflow/cookie";

export function saveToken(token) {
  setCookie('token', token, 30);
}