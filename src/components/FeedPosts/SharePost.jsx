import {
	Box,
	Image,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	Flex,
	Text
  } from "@chakra-ui/react";
  import PostFooter from "./PostFooter";
  import PostHeader from "./PostHeader";
import useGetFeedPostsById from "../../hooks/useGetFeedPostsById";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";
import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";  

const SharePost = ( ) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const videoRef = useRef(null);
	const { postId } = useParams();
   	const { isLoading, posts } = useGetFeedPostsById(postId);  
	   const { userProfile } = useGetUserProfileById(posts[0]?.createdBy);
	const handleOpen = () => setIsOpen(true);
	const handleClose = () => setIsOpen(false); 
	useEffect(() => {
	  if (videoRef.current) {
		  const options = {
			  root: null,
			  rootMargin: "0px",
			  threshold: 0.5,
		  };
  
		  const callback = (entries) => {
			  entries.forEach((entry) => {
				  if (entry?.isIntersecting) {
					  setIsVisible(true);
					  entry.target.play();
				  } else {
					  setIsVisible(false);
					  entry.target.pause();
				  }
			  });
		  };
  
		  const observer = new IntersectionObserver(callback, options);
		  observer?.observe(videoRef.current);
  
		  return () => {
			  if (videoRef.current && observer) {
				  observer.unobserve(videoRef.current);
			  }
		  };
	  }
  }, [videoRef.current]);
  
  return (
	<>
		{posts && posts.length > 0 && (
			<Box border={"1px solid gray"} borderRadius={4} mb={5} padding={2} background={"#272B33"} mt={85}>
				<PostHeader post={posts[0]} creatorProfile={userProfile} />
				<Box my={2} borderRadius={4} overflow="hidden" background={"#0A0C10"} justifyContent="center" alignItems="center">
					{posts[0]?.type === "img" ? (
						<Box display="flex" justifyContent="center" alignItems="center" width="100%">
							<Image
								cursor="pointer"
								width="100%"
								maxHeight="450px"
								objectFit="contain"
								src={posts[0]?.imageURL}
								alt="FEED POST IMG"
								onClick={handleOpen}
							/>
						</Box>
					) : (
						<Box
							as="video"
							ref={videoRef}
							controls
							autoPlay={isVisible} 
							cursor="pointer"
							width="100%"
							maxHeight="450px"
							src={posts[0]?.imageURL}
							onClick={handleOpen}
						/>
					)}
				</Box>
				<PostFooter post={posts[0]}  creatorProfile={userProfile} />
				<Modal isOpen={isOpen} onClose={handleClose} width="80%">
					<ModalOverlay style={{ backdropFilter: "blur(8px)" }} />
					<ModalContent>
						<ModalCloseButton color="white" />
						<ModalBody>
							<Flex
								direction="column"
								alignItems="center"
								justifyContent="center"
								h="100%"
							>
								{posts[0]?.type === "img" ? (
									<Image
										width="100%"
										maxHeight="800px"
										objectFit="scale-down"
										src={posts[0]?.imageURL}
										alt="FEED POST IMG"
									/>
								) : (
									<video
										controls
										autoPlay
										width="100%"
										maxHeight="800px"
										src={posts[0]?.imageURL}
										alt="FEED POST VIDEO"
									/>
								)}
								<Box mt={0}>
									<ModalCloseButton color="white" />
								</Box>
							</Flex>
						</ModalBody>
					</ModalContent>
				</Modal>
			</Box>
		)}
		{!posts && <ProfileHeaderSkeleton />}
	</>
);

  };
  
  export default SharePost;
  

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

