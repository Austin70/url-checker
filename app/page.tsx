'use client';
// import { urlRegex } from "@/constants/constant";
import { useMemo, useState } from "react";
import {debounce} from "lodash";

import getUrlContentExists from "./api/api";




export default function Home() {
  const [error, setError] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidHttpUrl = (urlParam: string) => {
  let url: URL;
  
  try {
    url = new URL(urlParam);
  } catch (_) {
    return false;  
  }

  if (url.origin.split('.').length === 1 || url.origin.split('.')[1].length < 2) {
    return false;
  }
  console.log(url.origin.split('.').length === 1, url.origin.split('.')[1], url.origin.split('.')[1]?.length < 2)

  return url.protocol === "http:" || url.protocol === "https:";
}

  const getUrlExists = async(data: string) => {
   const response = await getUrlContentExists(data)
   setError(response.message)
   setIsLoading(false)
  }

  const handleSearch = useMemo(() => debounce(getUrlExists, 1000),
    []
  );

  // console.log(handleSearch, "handleSearch")

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);

    if(isValidHttpUrl(e.target.value)) {
      setError("");
    } 
    else {
      setError("Please enter a valid URL.");
      setIsLoading(false);
      handleSearch.cancel();
      return
    }

    handleSearch(e.target.value)
    setIsLoading(true);
  
  };

  return (
    <>
      <h1 className="text-3xl font-bold underline items-center align-middle flex mx-auto">Url Checking Tool</h1>
      <label htmlFor="url">Enter URL to check:</label>
      <input
        className={`block mb-2.5 text-sm font-medium text-heading rounded-4xl border-black border-2 p-2 m-2`}
        type="text"
        name="url"
        id="url"
        placeholder="eg., https://example.com/folder1/folder2/file.js"
        onChange={handleChange}
        value={inputUrl}
      />
      {error && !isLoading && <p className={` ml-2 ${error == 'Folder exists in  server' || error == 'File exists in server' || error == 'Path exist in server' ? 'text-green-500' : 'text-red-500'}`}>{error}</p>}
      {isLoading && <p className="ml-2 text-blue-500">Checking URL...</p>}
    </>
  );
}
