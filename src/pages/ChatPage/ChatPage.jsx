import { Box, Button,Flex } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import CommunityChat from "../../components/chat/CommunityChat/Chat";
import GroupChat from "../../components/chat/groupChat/Chat";
import UserChat from "../../components/chat/userChat/Chat";
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { ChatLogo } from "../../assets/constants";
import Cam from "../../assets/img/cam.png"; 

const ChatPage = ({ feed = 0 }) => {
    const [selectedTab, setSelectedTab] = useState(feed);
    const [authUser] = useAuthState(auth);
    const navigate = useNavigate();
 
    useEffect(() => {
        const storedTab = localStorage.getItem("storedTab");
        if (storedTab) { 
            setSelectedTab(parseInt(storedTab));
        }
    }, []);
   
    const handleFeedTypeChange = (tabIndex) => { 
        setSelectedTab(tabIndex);
        localStorage.setItem("storedTab", tabIndex);
    };

    if (!authUser) {
        navigate("/auth");
        return null;
    }

    return (
        <Box mt={85} height="90vh" justifyContent="center" alignItems="center" width={{ base: "100%", md: "100%", lg: "850px" }} overflowY={"scroll"} css={{ scrollbarWidth: 'none' }}>
            <Flex p={2} width="100%"  justifyContent="center" gap={10}>
                <Button
                    fontSize={{ base: 12, md: 16 }} 
                    width={{ base: "85px", md: "115px" }} 
                    border={"1px solid #7A828E"}
                    bg={selectedTab === 0 ? "gray.800" : "transparent"}
                    borderColor={selectedTab === 0 ? "green.300" : ""} 
                    onClick={() => handleFeedTypeChange(0)}
                    mr={2}  
                >
                    Chat 
                </Button>
               <Button
                    fontSize={{ base: 12, md: 16 }} 
                    width={{ base: "85px", md: "115px" }} 
                    border={"1px solid #7A828E"}
                    bg={selectedTab === 1 ? "gray.800" : "transparent"}
                    borderColor={selectedTab === 1 ? "green.300" : ""} 
                    onClick={() => handleFeedTypeChange(1)}
                    mr={2}
                >
                    Groups
                </Button>
                <Button
                    fontSize={{ base: 12, md: 16 }} 
                    width={{ base: "85px", md: "115px" }} 
                    border={"1px solid #7A828E"}
                    bg={selectedTab === 2 ? "gray.800" : "transparent"}
                    borderColor={selectedTab === 2 ? "green.300" : ""} 
                    onClick={() => handleFeedTypeChange(2)}
                >
                    Communities
                </Button>
            </Flex>
            {selectedTab === 0 && <UserChat />}
            {selectedTab === 1 && <GroupChat />}
            {selectedTab === 2 && <CommunityChat />}
        </Box>
    );
}

export default ChatPage;
