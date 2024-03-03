import {
	Box,
	Image,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	Flex,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import PostFooter from "./PostFooter";
  import PostHeader from "./PostHeader";
  import useGetUserProfileById from "../../hooks/useGetUserProfileById";
  
  const FeedPost = ({ post }) => {
	const { userProfile } = useGetUserProfileById(post.createdBy);
	const [isOpen, setIsOpen] = useState(false);
  
	const handleOpen = () => setIsOpen(true);
	const handleClose = () => setIsOpen(false);
  
	return (
	  <>
		<PostHeader post={post} creatorProfile={userProfile} />
		<Box my={2} borderRadius={4} overflow="hidden">
		  <Image
			cursor="pointer"
			width={{ base: "100%", md: "650px", lg: "900px" }}
			height={{ base: "100%", md: "400px", lg: "400px" }}
			objectFit="contain"
			src={post.imageURL}
			alt="FEED POST IMG"
			onClick={handleOpen}
		  />
		</Box>
		<PostFooter post={post} creatorProfile={userProfile} />
  
		<Modal isOpen={isOpen} onClose={handleClose} width="80%">
		  <ModalOverlay />
		  <ModalContent>
			<ModalCloseButton color="white" />
			<ModalBody>
			  <Flex
				direction="column"
				alignItems="center"
				justifyContent="center"
				h="100%"
			  >
				<Image
				  width="100%"
				  height={{ base: "100%", md: "800px", lg: "800px" }}
				  objectFit="scale-down"
				  src={post.imageURL}
				  alt="FEED POST IMG"
				/>
				<Box mt={0}>
				  <ModalCloseButton color="white" />
				</Box>
			  </Flex>
			</ModalBody>
		  </ModalContent>
		</Modal>
	  </>
	);
  };
  
  export default FeedPost;
  