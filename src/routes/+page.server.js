const isResearchIDValid = (researchID) => {
  const researchIDs = [
    "ETYVUU",
    "18ZUPM",
    "H6PVM3",
    "RUIZ2E",
    "V2AI0J",
    "NOIHD2",
    "WV1IRD",
    "AOJ1GL",
    "R01IGU",
    "TWEBTQ",
    "AUHJC5",
    "OY50RU",
    "QA7JTH",
    "XTVR7G",
    "C1YKB1",
    "DT6KQ2",
    "EXD962",
    "PJX1K9",
    "P3N6O8",
    "05V68H",
    "83JW6O",
    "NLQWKD",
    "0SZMGQ",
    "ZUMBLN",
    "FCCFMQ",
    "JCI4Z9",
    "IVEPXI",
    "L2RHT8",
    "L5USZO",
    "CFG4YH",
    "35EB03",
    "JAL11H",
    "U3D7K3",
    "220Q7C",
    "DQLPAG",
    "LS3U8G",
  ];
  return researchIDs.find((str) => str === researchID);
};

export async function load({ url }) {
  // this just retrieves the research ID from the url (link passed to research participant) and checks it's valid
  let researchID = url.searchParams.get("researchID");
  let isRSIDvalid = false;
  if (isResearchIDValid(researchID)) isRSIDvalid = true;
  return { researchID, isRSIDvalid };
}
