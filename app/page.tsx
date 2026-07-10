'use client';
// import { urlRegex } from "@/constants/constant";
import { useMemo, useState } from "react";
import {debounce} from "lodash";

import getUrlContentExists from "./api/api";




export default function Home() {
  const [message, setMessage] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let counter = 0;

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

  return url.protocol === "http:" || url.protocol === "https:";
}
 let i=0;
  const getUrlExists = async(data: string) => {
    console.log("url start api call", ++i, counter, data)
    setIsLoading(true);
    // ++counter
    const response = await getUrlContentExists(data)
    counter--
    if(counter == 0) {
      setMessage(response.message)
      setIsLoading(false)
    }
    console.log("url api end call", i, counter)
  }

  const handleSearch = useMemo(() => debounce((arg:string) => {
    ++counter
    getUrlExists(arg)
  }, 1000),
    []
  );

  // console.log(handleSearch, "handleSearch")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);

    if(isValidHttpUrl(e.target.value)) {
      setMessage("");
    } 
    else {
      setMessage("Please enter a valid URL.");
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
      {message && !isLoading && <p className={` ml-2 ${message == 'Folder exists in  server' || message == 'File exists in server' || message == 'Path exist in server' ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
      {isLoading && <p className="ml-2 text-blue-500">Checking URL...</p>}
    </>
  );
}
