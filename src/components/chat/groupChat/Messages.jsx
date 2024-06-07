import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Box,Text } from "@chakra-ui/react"; // Import Chakra UI components
import { firestore } from "../../../firebase/firebase";
import { ChatContext } from "../../../context/ChatContextGroup";
import Message from "./Message";


const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  useEffect(() => {
    const unSub = onSnapshot(doc(firestore, "Groupchats", data?.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });
    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <Box alignContent={"center"} align={"center"} >
      {messages?.map((m) => (
        <Message message={m} key={m.id} />
      ))}

      {(!data.chatId==null) && messages.length==0 &&<Text align={"center"} mt={150}>No Messages Yet...</Text>}
      {data.chatId=="null" &&<Text align={"center"} mt={150}>Select Profile to Chat</Text>}
    </Box>
  );
};

export default Messages;
