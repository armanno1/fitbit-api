export async function load({ url, data }) {
  let authCode = url.searchParams.get("code");
  let rsid = data.rsid;
  let isRSIDvalid = data.isRSIDvalid;
  return { authCode, rsid, isRSIDvalid };
}
