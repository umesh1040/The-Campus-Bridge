import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

import { firestore } from "../../../firebase/firebase";
import { useMediaQuery } from "@chakra-ui/react";


import { AuthContext } from "../../../context/AuthContext";
import { Box, Input, Text, Image, Avatar,FormControl } from '@chakra-ui/react'; // Import Chakra UI components
import { ChatContext } from "../../../context/ChatContext";

const Search = ({ closeSidebar }) => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async (event) => {
    event.preventDefault(); 
    const q = query(
      collection(firestore, "users"),
    );

    try {
      const querySnapshot = await getDocs(q);
      const members = [];
      querySnapshot.forEach((doc) => {
          const userInfo = doc.data(); 
          const lowercaseFullName = userInfo.fullName.toLowerCase();
          if (lowercaseFullName.includes(username.toLowerCase())) {
              const fullNameParts = lowercaseFullName.split(" ");
              for (const part of fullNameParts) {
                  if (part.startsWith(username.toLowerCase())) {
                      members.push(userInfo);
                      break; // Once a match is found, no need to continue checking other parts
                  }
              }
          }
      });
      members.sort((a, b) => a.fullName.localeCompare(b.fullName));
      setUser(members);
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };
  const handleSelect = async (user) => { 
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(firestore, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(firestore, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(firestore, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            fullName: user?.fullName || user?.displayName,
            profilePicURL: user?.profilePicURL || user?.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(firestore, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}
    if(isMobile){
    closeSidebar();
    }
    dispatch({ type: "CHANGE_USER", payload: user });
    setUser(null);
    setUsername("")
  };
  return (
    <Box display="flex" flexDirection="column" m={1} >
      <Box borderBottom="1px solid gray" paddingBottom="5px">
        
				<form onSubmit={handleSearch}>
          
							<FormControl>
        <Input
          type="text"
          placeholder="Find a user"
          onSubmit={handleSearch}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          padding="14px"
          border="1px solid #a7bcff"
          _placeholder={{ color: "lightgray" }}
        />
        
							</FormControl>
        </form>
      </Box>
    <Box  maxH={200} overflowY={"scroll"}  css={{scrollbarWidth: 'none' }}> 
        {user?.map((user) =>(
        <Box display="flex" alignItems="center" cursor="pointer" marginTop="10px" onClick={() => handleSelect(user)} ml={2} mb={15}>
          <Avatar src={user?.profilePicURL} alt="" borderRadius="50%" width="50px" height="50px" objectFit="cover" />
          <Box marginLeft="10px" overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
            <Text fontSize="14px" fontWeight="500">{user?.fullName}</Text>
          </Box>
        </Box>
      ))}
    </Box>
    </Box>
  );
};

export default Search;
