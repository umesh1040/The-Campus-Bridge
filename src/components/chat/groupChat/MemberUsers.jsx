import {  VStack } from "@chakra-ui/react";
import MemberUser from "./MemberUser";
import useGetmembers from "../../../hooks/useGetMembers"
import React, { useContext, useState } from "react";
import { arrayUnion,query, where, doc, updateDoc,collection,getDoc,onSnapshot,getDocs } from "firebase/firestore"; // Import only necessary functions
import { firestore } from "../../../firebase/firebase";


import { AuthContext } from "../../../context/AuthContext";
import { Box, Input, Text, Image } from '@chakra-ui/react'; // Import Chakra UI components
import { ChatContext } from "../../../context/ChatContextGroup";
import useShowToast from "../../../hooks/useShowToast";

const FollowingUsers = () => {
	const { isLoading, membersUsers } = useGetmembers("Following");

	const [username, setUsername] = useState("");
	const [user, setUser] = useState(null);
	const [err, setErr] = useState(false);
  
	const { currentUser } = useContext(AuthContext);
	const { data, dispatch } = useContext(ChatContext);
  
	const showToast = useShowToast();
	const handleSearch = async (event) => {
		event.preventDefault(); 
	  const q = query(
		collection(firestore, "users")
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
		console.error("er",err);
	  }
	};
  
	const handleKey = (e) => {
	  e.code === "Enter" && handleSearch();
	};
	const handleSelect = async (users) => { 
	  try {
		const groupChatRef = collection(firestore, "GroupChat");
        const groupInfoRef = doc(groupChatRef, data.chatId);
    
        const groupInfoSnap = await getDoc(groupInfoRef); 
        let existingMembers = groupInfoSnap.data()?.groupInfo?.members || []; 
        if (!existingMembers.includes(users.uid)) {
          await updateDoc(groupInfoRef, {
            "groupInfo.members":  arrayUnion(users.uid)
          });
		  showToast("Success:","Member added successfully!");
        }else{
			showToast("Success:","Member already present!");

		}
	
	  } catch (err) {}
	  
	  setUser(null);
	  setUsername("")
	};

	if (isLoading) return null;

	return (
		<Box>
			 <Box display="flex" flexDirection="column" m={1}>
				<Box borderBottom="1px solid gray" paddingBottom="5px">
					
				<form onSubmit={handleSearch}>
					<Input
					type="text"
					placeholder="Find a user to add"
					onKeyDown={handleKey}
					onChange={(e) => setUsername(e.target.value)}
					value={username}
					padding="14px"
					border="1px solid #a7bcff"
					_placeholder={{ color: "lightgray" }}
					/>
					</form>
				</Box>
	   			{user?.map((user) =>(
					<Box display="flex" alignItems="center" cursor="pointer" marginTop="10px" onClick={() => handleSelect(user)} ml={2} mb={15}>
					<Image src={user?.profilePicURL} alt="" borderRadius="50%" width="50px" height="50px" objectFit="cover" />
					<Box marginLeft="10px" maxW={130} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
						<Text fontSize="14px" fontWeight="500">{user?.fullName}</Text>
					</Box>
					</Box>
				   ))}
			</Box>
			
			<VStack py={8} px={6} gap={4} al={"center"}  height={"50vh"} overflowY={"scroll"}>
				{membersUsers?.map((user) => (
					<MemberUser user={user} key={user.id} />
			))}
			</VStack>
		</Box>
	);
};

export default FollowingUsers;
