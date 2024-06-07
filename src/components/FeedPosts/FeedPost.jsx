import React, { useState, useRef, useEffect } from "react";
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
import useGetUserProfileById from "../../hooks/useGetUserProfileById";

const FeedPost = ({ post }) => { 
  const { userProfile } = useGetUserProfileById(post.createdBy);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef(null);

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
            entries?.forEach((entry) => {
                if (entry?.isIntersecting) {
                    setIsVisible(true);
                    entry?.target?.play();
                } else {
                    setIsVisible(false);
                    entry?.target.pause();
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
    <Box border={"1px solid gray"} borderRadius={4} mb={5} padding={2} background={"#272B33"}>
      <PostHeader post={post} creatorProfile={userProfile} />
      <Box my={2} borderRadius={4} overflow="hidden" background={"#0A0C10"} justifyContent="center" alignItems="center">
        {post?.type === "img" ? (
          <Box display="flex" justifyContent="center" alignItems="center" width="100%">
            <Image
              cursor="pointer"
              width="100%"
              maxHeight="450px"
              objectFit="contain"
              src={post.imageURL}
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
            src={post.imageURL}
            onClick={handleOpen}
          />
        )}
      </Box>
      <PostFooter post={post} creatorProfile={userProfile} />
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
              {post?.type === "img" ? (
                <Image
                  width="100%"
                  maxHeight="800px"
                  objectFit="scale-down"
                  src={post.imageURL}
                  alt="FEED POST IMG"
                />
              ) : (
                <video
                  controls
                  autoPlay
                  width="100%"
                  maxHeight="800px"
                  src={post.imageURL}
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
  );
};

export default FeedPost;
