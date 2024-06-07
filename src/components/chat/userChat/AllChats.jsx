import { Avatar, Box, Text, Flex, Image } from "@chakra-ui/react";  
import { Link } from "react-router-dom";
import useGetUserProfileByUserId from "../../../hooks/useGetUserProfileById";
const SuggestedUser = ({ chat }) => {   
const { userProfile } = useGetUserProfileByUserId(chat[1].userInfo.uid);
	return (
		<Flex  width={"100%"} gap={2}>
			<Avatar src={userProfile?.profilePicURL} alt="" width="50px" height="50px" borderRadius="50%" objectFit="cover" />
			<Box marginLeft="10px"  maxW={160} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
            <Text fontSize="14px" fontWeight="500">{userProfile?.fullName}</Text>
            <Text fontSize="12px" color="gray">{chat[1].lastMessage?.text}</Text>
          </Box>
		</Flex>
	);
};

export default SuggestedUser;
