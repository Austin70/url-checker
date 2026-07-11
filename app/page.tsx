'use client';
// import { urlRegex } from "@/constants/constant";
import { useEffect, useMemo, useState } from "react";
import {debounce} from "lodash";

import getUrlContentExists from "./api/api";

 let counter = 0;

export default function Home() {
 
  const [message, setMessage] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkedUrl, setCheckedUrl] = useState("");

  useEffect(() => {
    return () => {
      counter=0
    }
  },[])

  const isMessageColorGreen = message == 'Folder exists in  server' || message == 'File exists in server' || message == 'Path exist in server'; //Place all the constants in constants folder
  const isMessageCurrent = checkedUrl == inputUrl

  const isValidHttpUrl = (urlParam: string) => {
  let url: URL;
 
  try {
    url = new URL(urlParam); //Could use Regex commented above but will not satisfy all cases
  } catch (_) {
    return false;  
  }

  if (url.origin.split('.').length === 1 || url.origin.split('.')[1].length < 2) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
  const getUrlExists = async(data: string, id: number) => {
    console.log("url start api call", counter, data, id)
    setIsLoading(true);

    const response = await getUrlContentExists(data)
    // counter--

    if(counter == id) {
      setMessage(response.message)
      setCheckedUrl(data)
      setIsLoading(false)
      
    }
    console.log("url api end call", counter)
  }

  const handleSearch = useMemo(() => debounce((arg:string) => {
    ++counter
    getUrlExists(arg, counter)
  }, 1000),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value

    setInputUrl(newUrl);
    setCheckedUrl(newUrl)

    if(isValidHttpUrl(newUrl)) {
      setMessage("");
    } 
    else {
      setMessage("Please enter a valid URL.");
      setIsLoading(false);
      handleSearch.cancel();
      return
    }

    handleSearch(newUrl)
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
      {message && !isLoading && isMessageCurrent && <p className={` ml-2 ${isMessageColorGreen ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
      {(isLoading || !isMessageCurrent) && <p className="ml-2 text-blue-500">Checking URL...</p>}
    </>
  );
}
