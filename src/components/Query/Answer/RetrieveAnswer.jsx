import { Avatar, Box, Flex, VStack, IconButton, Text, Spinner, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { useEffect, useState } from "react";
import useAuthStore from "../../../store/authStore";
import useGetUserProfileByUserId from "../../../hooks/useGetUserProfileById";
import useGetVotes from "../../../hooks/useGetVotes";
import useDeleteAnswer from "../../../hooks/useDeleteAnswer";

import { MdDelete } from "react-icons/md";

const GetQuery = ({ query, setQuery }) => {
  const { isLoading, setIsLoading, error, upVoting, downVoting } = useGetVotes();
  const authUser = useAuthStore((state) => state.user);
  const [fileContent, setFileContent] = useState('');
  const { userProfile } = useGetUserProfileByUserId(query.uid);
  const [voteCount, setVoteCount] = useState(query.upVote.length - query.downVote.length);
  const [isUpvoteClicked, setIsUpvoteClicked] = useState(true);
  const [isDownvoteClicked, setIsDownvoteClicked] = useState(true);
  const [CheckdownVote, setIsCheckdownVote] = useState(query.downVote.includes(authUser.uid));
  const [CheckupVote, setIsCheckupVote] = useState(query.upVote.includes(authUser.uid));
  const { isDeleting, setIsDeleting,  deleteAnswer } = useDeleteAnswer();

  

  const RetieveFileContent = () => {
    
    const fetchFileContent = async () => {
      try {
        const response = await fetch(query.answerContents); 
        if (response.ok) {
          const content = await response.text();
          setFileContent(content);
        } else {
          console.error('Failed to fetch file content:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching file content:', error);
      }
    };

    fetchFileContent();
    return fileContent;
  };

  

  const handleVote = async (vote) => {
    setIsLoading(true);
    try {
      if (vote === 1) {     
        const upvoteSuccess = await upVoting(query.answerId, authUser.uid, vote);
        const optimisticVoteCount = voteCount + upvoteSuccess;
        setIsUpvoteClicked(optimisticVoteCount);
        setIsCheckupVote(optimisticVoteCount);
        setIsDownvoteClicked(!optimisticVoteCount); 
      } else if (vote === -1) {
        const upvoteSuccess = await downVoting(query.answerId, authUser.uid, vote);
        const optimisticVoteCount = voteCount + upvoteSuccess;
        setIsDownvoteClicked(optimisticVoteCount<0); 
        setIsCheckdownVote(optimisticVoteCount<0);
        setIsUpvoteClicked(!optimisticVoteCount<0);
      }
      
    } catch (error) {
      console.error('Error while voting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this answer?");
    if (isConfirmed) {
      setIsDeleting(true);
      try {
        await deleteAnswer(query.queryId);
        window.location.reload();
      } catch (error) {
        console.error('Error deleting query:', error);
      } finally {
        setIsDeleting(false);
      }
    } 
  };
  

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      w="full"
      p={1}
      borderBottom="1px solid #7A828E"
    >
      <Flex alignItems="center" gap={4} w="100%">
        <VStack spacing={2} alignItems="flex-start" w="100%">

        {query.uid === authUser.uid && (
        <Button 
          aria-label="Delete"
          variant="outline"
          colorScheme="red"
          size="sm"
          top="0"
          right="0"
          onClick={handleDelete}
          isLoading={isDeleting} 
          ml={"auto"}
        >
        <MdDelete size={20} cursor='pointer' /></Button>
      )}

          <Box fontSize="sm" color="gray.500" w="100%">			
            <div dangerouslySetInnerHTML={{ __html: RetieveFileContent() }} />
          </Box>

          <Flex direction="row" alignItems="center" w="full" justifyContent="space-between">
           
            <Flex direction="row" alignItems="center" justify="left" gap={2}>
              <IconButton
                icon={<AiOutlineArrowUp />}
                aria-label="Upvote"
                variant="outline"
                colorScheme={isUpvoteClicked && CheckupVote ? "green" : "gray"}
                onClick={() => handleVote(1)}
                isDisabled={isLoading}
              >
              </IconButton>
              
								
              <Text>{query.upVote.length - query.downVote.length}</Text>
              <IconButton
                icon={<AiOutlineArrowDown />}
                aria-label="Downvote"
                variant="outline"
                colorScheme={isDownvoteClicked && CheckdownVote  ? "red" : "gray"}
                onClick={() => handleVote(-1) }
                isDisabled={isLoading}
              />
            </Flex>

            <Box fontSize="sm" ml="auto" boxShadow="lg" border="1px solid #7A828E" borderRadius={5} p={1} width={"180px"} background={"#525964"}>
            <Flex alignItems="center" gap={2} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
               <Link to={`/${userProfile?.username}`}>
                  <Avatar src={userProfile?.profilePicURL} size="xs" />
                </Link>
                <VStack spacing={2} alignItems="flex-start">
                  <Link to={`/${userProfile?.username}`}>
                    <Box fontSize={12} fontWeight="bold">
                      {userProfile?.fullName}
                    </Box>
                    <Box fontSize={10}>
                      Answered: {(query.createdAt).toDate().toLocaleDateString()}
                    </Box>
                  </Link>
                </VStack>
              </Flex>
            </Box>
          </Flex>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default GetQuery;
