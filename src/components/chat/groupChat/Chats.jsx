import { doc, onSnapshot,collection,query,where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { firestore } from "../../../firebase/firebase";
import { Box, Image, Text } from '@chakra-ui/react'; // Import Chakra UI components

import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContextGroup";


const Chats = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null); // New state to track selected chat

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const chatsQuery = query(
        collection(firestore, "GroupChat"),
        where("groupInfo.members", "array-contains", currentUser.uid)
      );
    
      // Subscribe to the query snapshot
      const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
        const chatsData = [];
        querySnapshot.forEach((doc) => {
          chatsData.push({ id: doc.id, ...doc.data() });
        });
        setChats(chatsData);
      });
      return unsubscribe;
    };
    currentUser.uid && getChats();
    }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
    setSelectedChat(u); // Update selected chat
  };

  return (
    <Box overflowY={"auto"} css={{ scrollbarWidth: 'none' }}>
      {chats && Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
        <Box
          key={chat[0]}
          onClick={() => handleSelect(chat[1]?.groupInfo)}
          display="flex"
          alignItems="center"
          padding="10px"
          cursor="pointer"
          borderBottom="1px solid gray"
          backgroundColor={selectedChat === chat[1].groupInfo ? "#525964" : "transparent"} // Apply grey background for selected chat
        >
          <Image src={chat[1].groupInfo?.groupPicURL} alt="" width="50px" height="50px" borderRadius="50%" objectFit="cover" />
          <Box marginLeft="10px" maxW={160} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
            <Text fontSize="14px" fontWeight="500">{chat[1].groupInfo?.groupName}</Text>
            <Text fontSize="12px" color="gray">{chat[1].lastMessage}</Text>
          </Box>

        </Box>
      ))}
    </Box>
  );
};

export default Chats;
