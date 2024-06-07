import React, { useContext, useEffect, useState } from "react";
import { Avatar, Box, Flex, Image, Text, Button } from "@chakra-ui/react";
import Cam from "../../../assets/img/cam.png";
import Add from "../../../assets/img/add.png";
import More from "../../../assets/img/more.png";
import Messages from "./Messages";
import Inputs from "./Input";
import Sidebar from "./Sidebar";
import CreateGroup from "./CreateGroup";
import ManageMembersPopup from "./ManageMembersPopup";
import EditGroup from "./EditGroup";
import { ChatContext } from "../../../context/ChatContextGroup";
import { useMediaQuery } from "@chakra-ui/react";
import { onSnapshot, doc, query, where, collection,getDoc,updateDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { AuthContext } from "../../../context/AuthContext";
import Search from "./Search";
import { BiLogOut } from "react-icons/bi"; 
import useShowToast from "../../../hooks/useShowToast";

const Chat = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showManageMembersPopup, setShowManageMembersPopup] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false); // State variable for managing visibility of edit group modal
  const [chats, setChats] = useState([]);
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [selectedChat, setSelectedChat] = useState(null);
	const showToast = useShowToast();
 
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const openManageMembers = () => {
    setShowManageMembersPopup(true);
  };

  const closeManageMembers = () => {
    setShowManageMembersPopup(false);
  };

  // Function to open edit group modal
  const openEditGroupModal = () => {
    setShowEditGroupModal(true);
  };

  // Function to close edit group modal
  const closeEditGroupModal = () => {
    setShowEditGroupModal(false);
  };

  useEffect(() => {
    const getChats = () => {
      const chatsQuery = query(
        collection(firestore, "GroupChat"),
        where("groupInfo.members", "array-contains", currentUser.uid)
      );

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
    toggleSidebar();
    setSelectedChat(u);
    dispatch({ type: "CHANGE_USER", payload: u });
  };
  const handleLeave = async() => {
    if (!data.chatId) return;
   
    const confirmLeave = window.confirm("Are you sure you want to leave the group?");
    if (!confirmLeave) return; 
  
    const groupChatRef = doc(firestore, "GroupChat", data.chatId);
  
    const groupDoc = await getDoc(groupChatRef);
    if (!groupDoc.exists()) {
      console.error("Group chat document does not exist!");
      return;
    }
  
    const groupData = groupDoc.data();
    const updatedMembers = groupData.groupInfo.members.filter(memberId => memberId !== currentUser.uid);
  
    // Update members list in Firestore document
    try {
      await updateDoc(groupChatRef, {
        "groupInfo.members": updatedMembers
      });
      showToast("Success:","Left the group successfully!");
      dispatch({ type: "CHANGE_USER", payload: null });
    } catch (error) {
      console.error("Error leaving the group:", error);
    }
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
          <Flex direction="row" margin={"20px solid white"}>
            <Search closeSidebar={toggleSidebar} /> <CreateGroup />
          </Flex>
          {chats &&
            Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
              <Box
                key={chat[0]}
                onClick={() => handleSelect(chat[1]?.groupInfo)}
                display="flex"
                alignItems="center"
                padding="10px"
                cursor="pointer"
                borderBottom="1px solid gray"
                backgroundColor={selectedChat === chat[1].groupInfo ? "#525964" : "transparent"}
              >
                <Image
                  src={chat[1].groupInfo?.groupPicURL}
                  alt=""
                  width="50px"
                  height="50px"
                  borderRadius="50%"
                  objectFit="cover"
                />
                <Box marginLeft="10px" maxW={"80%"} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                  <Text fontSize="14px" fontWeight="500">{chat[1].groupInfo?.groupName}</Text>
                  <Text fontSize="12px" color="gray">{chat[1].lastMessage}</Text>
                </Box>
              </Box>
            ))}
        </Box>
      )}
      <Box flex="1">
        <Flex
          direction="row"
          align="center"
          justify="space-between"
          color="lightgray"
          height="50px"
          border={"1px solid #7A828E"}
          borderTopRightRadius={5}
          width="100%"
        >
          <Flex gap={2} alignItems={"center"}>
            <Avatar
              src={data?.user?.groupPicURL}
              alt=""
              width="30px"
              height="30px"
              borderRadius="50%"
              objectFit="cover"
              ml={1}
            />
            <Text width="210px">{data?.user?.groupName}</Text>
          </Flex>
          <Flex mr={5} alignItems={"center"}>
            <Image src={Add} alt="" height="24px" cursor="pointer" onClick={openManageMembers} />
            {isMobile && (
              <Image
                src={More}
                alt=""
                height="24px"
                cursor="pointer"
                alignItems={"end"}
                onClick={toggleSidebar}
              />
            )}
            {currentUser.uid == data?.user?.createdBy && (
              // Button to open edit group modal
              <Button onClick={openEditGroupModal}>edit</Button>
            )}
            
            {currentUser.uid != data?.user?.createdBy && (
                <Flex
                onClick={handleLeave}
                alignItems={"center"}
                _hover={{ bg: "whiteAlpha.400" }}
                borderRadius={6}
                p={2}
                w={{ base: 10, md: "full" }}
                justifyContent={{ base: "center", md: "flex-start" }}
                >
                  <BiLogOut size={20} />
                </Flex>
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
            
            {data.chatId!=null && (
            <Messages />
            )}
          </Box>
          {!showSidebar && isMobile && <Inputs />}
          {!isMobile && <Inputs />}
        </Flex>
      </Box>
      {/* Render ManageMembersPopup if showManageMembersPopup is true */}
      {showManageMembersPopup && (
        <ManageMembersPopup onClose={closeManageMembers} />
      )}
       {showEditGroupModal && (
        <EditGroup 
        isOpen={showEditGroupModal}
        onClose={closeEditGroupModal}
        groupId={data.user?.groupId}
        groupName={data.user.groupName}
        groupPicURL={data.user.groupPicURL} />
      )}
    </Flex> 
    
  );
};

export default Chat;
