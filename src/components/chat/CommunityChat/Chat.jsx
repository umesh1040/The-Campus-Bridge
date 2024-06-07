import React, { useContext, useEffect, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import Cam from "../../../assets/img/cam.png";
import Add from "../../../assets/img/add.png";
import More from "../../../assets/img/more.png";
import Messages from "./Messages";
import Inputs from "./Input";
import Sidebar from "./Sidebar";
import { ChatContext } from "../../../context/ChatContextCommunity";
import { useMediaQuery } from "@chakra-ui/react";
import { onSnapshot, doc,collection } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { AuthContext } from "../../../context/AuthContext";

const Chat = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext);
  const [showSidebar, setShowSidebar] = useState(false);
  const [chats, setChats] = useState([]);
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [selectedChat, setSelectedChat] = useState(null); 
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(collection(firestore, "CommunityChat"), (querySnapshot) => {
        const chatsData = [];
        querySnapshot.forEach((doc) => {
          chatsData.push({ id: doc.id, ...doc.data() });
        });
        setChats(chatsData);
      });

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
    <Flex width="100%" height={"80vh"}>
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
          <Text fontSize={"1.05em"} align={"center"} padding={2} borderBottom={"1px solid black"}>Welcome to The Campus Bridge Community</Text>
          <Box>
            {Object.entries(chats)
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
                  backgroundColor={selectedChat === chat[1].userInfo ? "#525964" : "transparent"} // Apply grey background for selected chat
                >
                  <Image
                    src={chat[1].userInfo?.profilePicURL}
                    alt=""
                    width="50px"
                    height="50px"
                    borderRadius="50%"
                    objectFit="cover"
                  />
                  <Box marginLeft="10px" maxW={"80%"} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                    <Text fontSize="18px" fontWeight="500">
                      {chat[1].userInfo?.fullName}
                    </Text>
                    <Text fontSize="14px" color="gray">
                      {chat[1].lastMessage?.text}
                    </Text>
                  </Box>
                </Box>
              ))}
          </Box>
          
        </Box>
      )}

      <Box flex="1">
        <Flex
          direction="row"
          align="center"
          justify="space-between"
          color="lightgray"
          height="50px"
          px="10px"
          border={"1px solid #7A828E"}
          borderTopRightRadius={5}
        >
          <Flex gap={2} alignItems={"center"}>
            <Image
              src={data.user.profilePicURL}
              alt=""
              width="25px"
              height="25px"
              borderRadius="50%"
              objectFit="cover"
            />
            <Text>{data.user?.fullName}</Text>
          </Flex>

          <Flex>
             {isMobile && (
              <Image
                src={More}
                alt=""
                height="24px"
                cursor="pointer"
                mx="5px"
                onClick={toggleSidebar}
              />
            )}
          </Flex>
        </Flex>
        <Flex
          direction="column"
          background={"transparent"}
          borderRight={!isMobile ? "0.5px solid #7A828E" : ""}
          borderBottom={!isMobile ? "0.5px solid #7A828E" : ""}
          border={isMobile ? "0.5px solid #7A828E" : ""}
          h="87.5%"
          borderEndEndRadius={5}

        >
          <Box height={"90%"} overflowY={"scroll"} css={{ scrollbarWidth: "thin" }}>
            <Messages />
          </Box>
          { (!showSidebar && isMobile )  && <Inputs /> }
          {(!isMobile ) && <Inputs /> }
        </Flex>
      </Box>
    </Flex>
  );
};

export default Chat;
