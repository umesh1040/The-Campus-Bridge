import { Avatar, Box, Flex, VStack,Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {  useState } from "react";

import useAuthStore from "../../store/authStore";
import useDeleteQuery from "../../hooks/useDeleteQuery";
import useGetUserProfileByUserId from "../../hooks/useGetUserProfileById";

import { MdDelete } from "react-icons/md";
const GetQuery = ({ query, setQuery }) => {
  const [fileContent, setFileContent] = useState('');
  const { userProfile } = useGetUserProfileByUserId(query.uid);
  const { isDeleting, setIsDeleting,  deleteQuery } = useDeleteQuery();
  const authUser = useAuthStore((state) => state.user);  
 

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this query?");
    if (isConfirmed) {
      setIsDeleting(true);
      try {
        await deleteQuery(query.queryId);
        window.location.reload();
      } catch (error) {
        console.error('Error deleting query:', error);
      } finally {
        setIsDeleting(false);
      }
    } else {
    }
  };

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      p={4}
      border={"1px solid gray"} borderRadius={10} mb={5}
      background={"#272B35"}
    >
      

      <VStack spacing={2} alignItems="flex-start" w="full">
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
        <Box fontSize="sm"  width="100%">
          <Link to={`/query/${query.queryId}`} width="100%" ml="auto">
          <Box fontSize="lg" textAlign="justify">{query.queryTitle}</Box>
            <Box fontSize="sm" >{query.queryKeywords}</Box>
          </Link>
        </Box>
        <Flex direction={"row"} alignItems="center" w="full">
        <Box fontSize="sm" ml="auto" boxShadow="lg" border="1px solid #7A828E" borderRadius={5} p={1} width={"180px"} background={"#525964"}>
            <Flex alignItems="center" gap={2} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
              <Link to={`/${userProfile?.username}`}>
                <Avatar src={userProfile?.profilePicURL} size={"xs"} />
              </Link>
              <VStack spacing={2} alignItems={"flex-start"}>
                <Link to={`/${userProfile?.username}`}>
                  <Box fontSize={12} fontWeight={"bold"}>
                    {userProfile?.fullName}
                  </Box>
                  <Box fontSize={10} >
                    Created: {(query.createdAt).toDate().toLocaleDateString()}
                  </Box>
                </Link>
              </VStack>
            </Flex>
          </Box>
        </Flex>
      </VStack>
    </Flex>
  );
};

export default GetQuery;
