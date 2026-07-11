import { urlErrors } from "../types/types";

const getMessage = (host:string, url: URL, data: string, validFileUrl:string, isFolderStructureCorrect: boolean, urlPathArray: string[]) => {

  if (host != url.hostname) { // Need to remove www if present
   return  "host does not exist in server";
  }

  if (data.toLowerCase() == validFileUrl.toLowerCase()) { // Need to remove protocol
    return "File exists in server";
  }

  if(!isFolderStructureCorrect) return "Path does not exist in server";

  if (isFolderStructureCorrect && urlPathArray.length >= 1) {
    return "Folder exists in  server";
  } else {
    return "Path exist in server";
  }

}

const getUrlContentExists: (
  data: string,
  error?: string,
  delay?: number,
) => Promise<urlErrors> = async (
  data = "",
  error = "unknown server error",
  delay = 1000,
) => {
  const validFileUrl = "https://example.com/folder1/folder2/file.js";

  const host = "example.com";
  const validUrlPathFolderArray = ["folder1", "folder2", "file.js"];

  const url = new URL(data);
  const urlPathArray = url.pathname.split("/").filter((path) => path != "");


  const isFolderStructureCorrect = urlPathArray.every(
    (folderName, index) =>
      folderName.toLowerCase() == validUrlPathFolderArray[index].toLowerCase(),
  );
const message = getMessage(host, url, data, validFileUrl, isFolderStructureCorrect, urlPathArray)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!!data) {
        resolve({
          type: "Success",
          message,
        });
      } else {
        reject({
          type: "Error",
          message: error,
        });
      }
    }, delay);
  });
};

export default getUrlContentExists;
