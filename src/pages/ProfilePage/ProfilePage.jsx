import { Container, Flex, Link, Skeleton, SkeletonCircle, Text, VStack,Divider } from "@chakra-ui/react";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileTabs from "../../components/Profile/ProfileTabs";
import ProfilePosts from "../../components/Profile/ProfilePosts";
import ProfileInfo from "../../components/Profile/ProfileInfo";
import useGetUserProfileByUsername from "../../hooks/useGetUserProfileByUsername";
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams, useNavigate } from "react-router-dom";
import React, { useState } from "react";
const ProfilePage = () => {
	const { username } = useParams();
	
	const { isLoading, userProfile } = useGetUserProfileByUsername(username);
	const [authUser] = useAuthState(auth);
	const navigate = useNavigate();
	if(!authUser?.uid){
		navigate("/auth");
		return null;
	}  
	
	const [selectedTab, setSelectedTab] = useState("posts");
	const handleTabSelect = (tabName) => {
	  setSelectedTab(tabName);
	};

	return (
		
		<Container maxW='container.lg' py={5} width={"100%"} alignContent={"center"}> 
			<Flex py={10} px={4} pl={{ base: 4, md: 10 }}  minW={{base:"320px",md:"600px",lg:"650px"}} flexDirection={"column"}				
				border={"2px solid"}
				borderColor={"#525964"}
				mt={65}
				justifyContent="center" 
				alignItems="center" 
				>
				{!isLoading && userProfile && <ProfileHeader />}
				{isLoading && <ProfileHeaderSkeleton />}
				
			</Flex>
			<Flex
				px={{ base: 2, sm: 4 }}
				maxW={"full"}
				mx={"auto"}
				direction={"column"}
			>
			</Flex>

			<Flex
				px={{ base: 2, sm: 4 }}
				maxW={"full"}
				mx={"auto"}
				direction={"column"}
			>
				<Divider my={2} borderColor="#7A828E" />
				<ProfileTabs onSelectTab={handleTabSelect} />
				<Divider my={2} borderColor="#7A828E" />
			<Flex width={"100%"}>
				{selectedTab === "posts" && <ProfilePosts />}
				{selectedTab === "info" && <ProfileInfo />}
				</Flex>
			</Flex>
		</Container>
	);
};

export default ProfilePage;

const ProfileHeaderSkeleton = () => {
	return (
		<Flex
			gap={{ base: 4, sm: 10 }}
			py={10}
			direction={{ base: "column", sm: "row" }}
			justifyContent={"center"}
			alignItems={"center"}
		>
			<SkeletonCircle size='24' />

			<VStack alignItems={{ base: "center", sm: "flex-start" }} gap={2} mx={"auto"} flex={1}>
				<Skeleton height='12px' width='150px' />
				<Skeleton height='12px' width='100px' />
			</VStack>
		
		</Flex>
	);
};

