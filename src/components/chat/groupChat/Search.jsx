import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { firestore } from "../../../firebase/firebase";
import { AuthContext } from "../../../context/AuthContext";
import { Box, Input, Text, Image, Avatar } from '@chakra-ui/react';
import { ChatContext } from "../../../context/ChatContextGroup";

import { useMediaQuery } from "@chakra-ui/react";
const Search = ({ closeSidebar }) => {
  const [username, setUsername] = useState("");
  const [members, setMembers] = useState([]);
  const [err, setErr] = useState(false);

  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { currentUser } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext);

  const handleSearch = async (event) => {
    event.preventDefault(); 
    const q = query(
      collection(firestore, "GroupChat"),
    );

    try {
      const querySnapshot = await getDocs(q);
      const members = [];
      
      querySnapshot.forEach((doc) => {
          const groupInfo = doc.data().groupInfo;
          const lowercaseGroupName = groupInfo.groupName.toLowerCase();
          if (lowercaseGroupName.includes(username.toLowerCase())) {
              members.push(groupInfo);
          }
      });
      
      members.sort((a, b) => a.groupName.localeCompare(b.groupName));
      setMembers(members);
      
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = (selectedGroup) => {
    
    if(isMobile)
    closeSidebar();
    dispatch({ type: "CHANGE_USER", payload: selectedGroup });
    setUsername("");
    setMembers([]);
  };

  return (
    <Box display="flex" flexDirection="column" m={1} width={"100%"} >
      <Box borderBottom="1px solid gray" paddingBottom="5px">
        
				<form onSubmit={handleSearch}>
        <Input
          type="text"
          placeholder="Find a group"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          padding="14px"
          border="1px solid #a7bcff"
          _placeholder={{ color: "lightgray" }}
        />
        </form>
      </Box>
    <Box  maxH={200} overflowY={"scroll"}  css={{scrollbarWidth: "none" }}> 
      {members?.map((member) => (
        <Box
          key={member.groupId} // Assuming groupId is unique
          display="flex"
          alignItems="center"
          cursor="pointer"
          marginTop="10px"
          onClick={() => handleSelect(member)}
          ml={2}
          mb={5}
        >
          <Avatar
            src={member?.groupPicURL}
            alt=""
            borderRadius="50%"
            width="50px"
            height="50px"
            objectFit="cover"
          />
          <Box marginLeft="10px" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
            <Text fontSize="14px"  >{member?.groupName}</Text>
          </Box>
        </Box>
      ))}
    </Box>

    </Box>
  );
};

export default Search;
