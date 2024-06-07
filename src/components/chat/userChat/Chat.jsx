import React, { useContext, useEffect, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import More from "../../../assets/img/more.png";
import Messages from "./Messages";
import Inputs from "./Input";
import Sidebar from "./Sidebar";
import Search from "./Search";
import { ChatContext } from "../../../context/ChatContext";
import { useMediaQuery } from "@chakra-ui/react";
import { onSnapshot, doc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { AuthContext } from "../../../context/AuthContext";
import useGetUserProfileByUserId from "../../../hooks/useGetUserProfileById"; 

import Allchats from "./AllChats"
const Chat = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext);
  const [showSidebar, setShowSidebar] = useState(false);
  const [chats, setChats] = useState([]);
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [selectedChat, setSelectedChat] = useState(null);
  const { userProfile } = useGetUserProfileByUserId(data.user?.uid); 
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(firestore, "userChats", currentUser.uid),
        (doc) => {
          setChats(doc.data());
        }
      );

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    toggleSidebar();
    setSelectedChat(u); // Set the selected chat
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <Flex width="100%" height={"80vh"} >
      {!isMobile && <Sidebar show={showSidebar} chats={chats} handleSelect={handleSelect} />}
      {showSidebar && isMobile && (
        <Box
        flexDirection="column"
        backgroundColor="#001122"
        display={"flex"}
        position={"absolute"}
        align={"start"}
        width="88%"
        height={"75%"}
        margin={1}
        overflowY="scroll"
        mt={55}
        >
          <Search closeSidebar={toggleSidebar}  />
          {chats &&
          <Box>
            {Object?.entries(chats)
              ?.sort((a, b) => b[1].date - a[1].date)
              .map((chat) => (
                <Box
                  key={chat[0]}
                  onClick={() => handleSelect(chat[1].userInfo)}
                  display="flex"
                  alignItems="center"
                  padding="10px"
                  cursor="pointer"
                  borderBottom="1px solid gray"
                  backgroundColor={selectedChat === chat[1].userInfo ? "#ccc" : "transparent"} // Apply grey background for selected chat
                >
                  <Allchats chat={chat} />
                </Box>
              ))}
          </Box>
          }
        </Box>
      )}

      <Box flex="1">
        <Flex
          direction="row"
          justify="space-between"
          color="lightgray"
          height="50px"
          border={"1px solid #7A828E"}
          borderTopRightRadius={5}
          width= '100%'
        >
          <Flex gap={2} alignItems={"center"} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
            <Image
              src={userProfile?.profilePicURL}
              alt=""
              width="25px"
              alignSelf={"center"}
              height="25px"
              borderRadius="50%"
              objectFit="cover"
              ml={2}
              
            />
            <Text  width= '210px'>{userProfile?.fullName}</Text>
          </Flex>

          <Flex  mr={5} alignItems={"center"}>
          {isMobile && (<Image src={More} alt="" height="24px" cursor="pointer"  alignItems={"end"}  onClick={toggleSidebar}/>
            )}
          </Flex>
        </Flex>
        <Flex
          direction="column"
          background={"transparent"}
          borderRight={!isMobile ? "0.5px solid #7A828E" : ""}
          borderBottom={!isMobile ? "0.5px solid #7A828E" : ""}
          border={isMobile ? "0.5px solid #7A828E" : ""}
          h="70vh"
          borderEndEndRadius={5}
        >
          <Box height={"90%"} overflowY={"scroll"} css={{ scrollbarWidth: "thin" }}>
            <Messages />
          </Box>
          { (!showSidebar && isMobile)  && <Inputs /> }
          {(!isMobile) && <Inputs /> }
        </Flex>
      </Box>
    </Flex>
  );
};

export default Chat;
