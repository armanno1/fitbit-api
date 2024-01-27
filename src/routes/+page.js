import { browser } from "$app/environment";

export async function load({ url, data }) {
  let authCode = url.searchParams.get("code");
  let researchID = data.researchID;
  let isRSIDvalid = data.isRSIDvalid;
  return { authCode, researchID, isRSIDvalid };
}
