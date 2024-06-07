import { doc, onSnapshot, collection, query, where,or } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { firestore } from "../../../firebase/firebase";
import { Box, Image, Text, Select } from '@chakra-ui/react'; // Import Chakra UI components

import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContextCommunity";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null); // New state to track selected chat
  const [selectedDepartment, setSelectedDepartment] = useState(""); // New state to track selected department

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext); 

  useEffect(() => {
    const getChats = () => {
      let chatQuery = collection(firestore, "CommunityChat");

      // If a department is selected, add a where clause to filter chats by department
      if (selectedDepartment) {
        chatQuery = query(chatQuery, or(where("departmentName", "==", selectedDepartment),(where("departmentName", "==", "all"))));
      }

      const unsub = onSnapshot(chatQuery, (querySnapshot) => {
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
  }, [currentUser.uid, selectedDepartment]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
    setSelectedChat(u);  
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  return (
    <Box>
      <Select value={selectedDepartment} onChange={handleDepartmentChange} mb={4}>
        <option value="">Select Department</option>
        <option value="Computer Science and Engineering">Computer Science and Engineering</option>
        <option value="Mechanical Engineering">Mechanical Engineering</option>
        <option value="Food Technology">Food Technology</option>
        <option value="Electronics Engineering">Electronics Engineering</option>
        <option value="Computer Science and Technology">Computer Science and Technology</option>
        <option value="Electrical Engineering">Electrical Engineering</option>
        <option value="Civil Engineering">Civil Engineering</option>
        <option value="Information Technology">Information Technology</option>
        <option value="Electronics and Telecommunication Technology">Electronics and Telecommunication Technology</option>
      </Select>
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
            <Image src={chat[1].userInfo?.profilePicURL} alt="" width="50px" height="50px" borderRadius="50%" objectFit="cover" />
            <Box marginLeft="10px" maxW={160} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
              <Text fontSize="14px" fontWeight="500">{chat[1].userInfo?.fullName}</Text>
              <Text fontSize="12px" color="gray">{chat[1]?.lastMessage}</Text>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Chats;
