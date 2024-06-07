import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Image, Text, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Flex } from "@chakra-ui/react";
import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import useGetUserProfileByUserId from "../../../hooks/useGetUserProfileById";
import { Link } from "react-router-dom";
import useAuthStore from "../../../store/authStore"
const Message = ({ message }) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [conversationStartDate, setConversationStartDate] = useState(null);
  const messageRef = useRef(null);
	const authUser = useAuthStore((state) => state.user);
  const { userProfile } = useGetUserProfileByUserId(message.senderId);
  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
    if (!conversationStartDate || message.date.toMillis() < conversationStartDate.toMillis()) {
      setConversationStartDate(message.date);
    }
  }, [message, conversationStartDate]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const formatMessageDate = (messageDate) => {
    const currentDate = new Date();
    const messageDateTime = messageDate.toDate();

    if (
      currentDate.getDate() === messageDateTime.getDate() &&
      currentDate.getMonth() === messageDateTime.getMonth() &&
      currentDate.getFullYear() === messageDateTime.getFullYear()
    ) {
      return "Today";
    } else if (
      currentDate.getDate() - messageDateTime.getDate() === 1 &&
      currentDate.getMonth() === messageDateTime.getMonth() &&
      currentDate.getFullYear() === messageDateTime.getFullYear()
    ) {
      return "Yesterday";
    } else {
      return messageDateTime.toLocaleDateString();
    }
  };

  return (
    <Box padding="20px">
      <Box
        display="flex"
        flexDirection={message.senderId === currentUser.uid ? "row-reverse" : "row"}
        marginBottom="-30px"
        ref={messageRef}
      >
        <Box
          display="flex"
          flexDirection="column"
          maxWidth="80%"
          alignItems={message.senderId === currentUser.uid ? "flex-end" : ""}
        >
          {message.img && (
            <>
            <Image
              src={message.img}
              alt="Attached"
              alignItems={message.senderId === currentUser.uid ? "flex-end" : ""}
              width={"300px"}
              maxH={"320px"}
              objectFit="cover"
              border={"1px solid #7A828E"}
              onClick={handleOpen}
            />
             <Flex justifyContent={"end"} mb={2} mt={1}>
              <span style={{ fontSize: "0.6em", color: "white" }}>{formatMessageDate(message.date)}</span>
              <span style={{marginLeft:"5px", fontSize: "0.6em", color: "white" }}>
                {message.date.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </Flex>
            </>
          )}
          {message.video && (
            <>
            <video src={message.video} controls height="250px" width={300}>
              Your browser does not support the video tag.
            </video>
            <Flex justifyContent={"end"} mb={2} mt={1}>
            <span style={{ fontSize: "0.6em", color: "white" }}>{formatMessageDate(message.date)}</span>
            <span style={{marginLeft:"5px", fontSize: "0.6em", color: "white" }}>
              {message.date.toDate().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </Flex>
            </>
          )}
          {message.pdf && (
            <>
            <iframe src={message.pdf} type="application/pdf" width="100%" height="350px" />
            <Flex justifyContent={"end"} mb={2} mt={1}>
            <span style={{ fontSize: "0.6em", color: "white" }}>{formatMessageDate(message.date)}</span>
            <span style={{marginLeft:"5px", fontSize: "0.6em", color: "white" }}>
              {message.date.toDate().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </Flex>
          </>
          )}
          {message.text !== "" && (
            <>
        <Text
            backgroundColor={message.senderId === currentUser.uid ? "#8da4f1" : "white"}
            alignItems={message.senderId === currentUser.uid ? "flex-end" : "start"}
            align={message.senderId === currentUser.uid ? "right" : "left"} 
            textAlign={message.senderId === currentUser.uid ? "right" : "justify"}
            color={message.senderId === currentUser.uid ? "white" : "black"}
            padding="10px 20px"
            borderRadius={
              message.senderId === currentUser.uid
                ? "10px 0px 10px 10px"
                : "0px 10px 10px 10px"
            }
            maxWidth="300px"
            marginBottom="10px"
          >
            {message.text} 
              <Flex justifyContent={"end"}>
                <span style={{ fontSize: "0.6em", color: "black" }}>{formatMessageDate(message.date)}</span>
                <span style={{marginLeft:"5px", fontSize: "0.6em", color: "black" }}>
                  {message.date.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </Flex>
            </Text>
            
            </>
          )}
          <Link to={`/${userProfile?.username}`}>
          <Box
            display="flex"
            flexDirection="row"
            color="gray"
            fontWeight="300"
            alignItems=  "start" 
            mt={-2}
          >
            <Image
              src={message.senderId === currentUser.uid ? authUser.profilePicURL || currentUser.photoURL : userProfile?.profilePicURL}
              alt=""
              width="25px"
              height="25px"
              borderRadius="50%"
              objectFit="cover"
            />
               <Text alignSelf={"center"}ml={1} fontSize= "0.6em" color= "white"> {userProfile?.fullName}</Text>
     
          </Box>
          </Link>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={handleClose} size="full" scrollBehavior="inside" mt={10} >
        <ModalOverlay style={{ backdropFilter: "blur(8px)" }} />
        <ModalContent bg="transparent" overflowY="auto" mt={1} >
          <ModalBody>
            <Flex direction="column" align="center" gap={1}>
              <Box position="relative">
                <ModalCloseButton color="red" position="absolute" top="10px" right="10px" zIndex="1" background={"#ffffff"} />
                <Image align="center" objectFit="scale-down" src={message.img} border={"2px solid black"} />
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>


    </Box>
  );
};

export default Message;
