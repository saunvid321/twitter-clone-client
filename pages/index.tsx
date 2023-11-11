import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { BiImageAlt } from "react-icons/bi";
import FeedCard from "@/components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import { useCreateTweet, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import Twitterlayout from "@/components/FeedCard/Layout/TwitterLayout";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/clients/api";
import { getAllTweetsQuery, getSignedUrlForTweet } from "@/graphql/query/tweet";
import Input from "postcss/lib/input";
import toast from "react-hot-toast";
import axios from "axios";

interface HomeProps {
  tweets?: Tweet[];
}

export default function Home(props: HomeProps) {
  const { user } = useCurrentUser();

  const { mutateAsync } = useCreateTweet();
  const {tweets= props.tweets as Tweet[]}=useGetAllTweets();

  const [content, setContent] = useState("");
  const [imageURL,setImageURL]=useState("");

 


  const handelInputChangeFile=useCallback((input: HTMLInputElement)=>{
    return  async (event:Event)=>{
      event.preventDefault();
      const file: File| null| undefined = input.files?.item(0);
      if(!file) return;

      const {getSignedURLForTweet}= await graphqlClient.request(getSignedUrlForTweet ,{
        imageName: file.name,
        imageType: file.type
      })

      if (getSignedURLForTweet){
        toast.loading('Uploading...',{id:'2'})
        await axios.put(getSignedURLForTweet,file,{
          headers:{
            'Content-Type':file.type
          }
        })
        toast.success("Uplod Completed",{id:'2'})

        const url=new URL(getSignedURLForTweet);
        const myFilePath=`${url.origin}${url.pathname}`
        setImageURL(myFilePath)

      }
      
    }
  },[])

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    const hadelerFn=handelInputChangeFile(input)

    input.addEventListener("change", hadelerFn);
    input.click();
  }, [handelInputChangeFile]);

  const handleCreateTweet = useCallback(async () => {
    mutateAsync({
      content,
      imageURL,
    });
    setContent("")
    setImageURL("")
  }, [content, mutateAsync, imageURL]);

  return (
    <div>
      <Twitterlayout>
        <div>
          <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-1">
                {user?.profileImageURL && (
                  <Image
                    className="rounded-full"
                    src={user?.profileImageURL}
                    alt="user-image"
                    height={50}
                    width={50}
                  />
                )}
              </div>
              <div className="col-span-11">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent text-xl px-3 border-b border-slate-700"
                  placeholder="What's happening?"
                  rows={3}
                ></textarea>
                {
                  imageURL && <Image 
                  src={imageURL} 
                  alt="tweet-image" 
                  width={300} height={300}/>
                }
                <div className="mt-2 flex justify-between items-center">
                  <BiImageAlt onClick={handleSelectImage} className="text-xl" />
                  <button
                    onClick={handleCreateTweet}
                    className="bg-[#1d9bf0] font-semibold text-sm py-2 px-4 rounded-full"
                  >
                    Tweet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {tweets?.map((tweet) =>
          tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null
        )}
      </Twitterlayout>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  const allTweets = await graphqlClient.request(getAllTweetsQuery);
  return {
    props: {
      tweets: allTweets.getAllTweets as Tweet[],
    },
  };
};
function mutate(arg0: { content: string; imageURL: string; }) {
  throw new Error("Function not implemented.");
}

