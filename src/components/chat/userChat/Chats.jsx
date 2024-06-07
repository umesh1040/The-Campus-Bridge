import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { firestore } from "../../../firebase/firebase";
import { Box, Image, Text } from '@chakra-ui/react'; // Import Chakra UI components

import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import Allchats from "./AllChats"
import useGetUserProfileByUserId from "../../../hooks/useGetUserProfileById";
const Chats = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null); // New state to track selected chat
  

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(firestore, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
    setSelectedChat(u); // Update selected chat
    const { userProfile } = useGetUserProfileByUserId(currentUser.uid); 
  };

  const getUserProfile = async (uid) => {
  }
  return (
    <Box overflowY={"auto"} css={{ scrollbarWidth: 'none' }}>
      {chats && Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
        <Box
          key={chat[0]}
          onClick={() => handleSelect(chat[1]?.userInfo)}
          display="flex"
          alignItems="center"
          padding="10px"
          cursor="pointer"
          borderBottom="1px solid gray"
          backgroundColor={selectedChat === chat[1].userInfo ? "#525964" : "transparent"} // Apply grey background for selected chat
        >
          <Allchats chat={chat} />
          
        </Box>
      ))}
    </Box>
  );
};

export default Chats;
