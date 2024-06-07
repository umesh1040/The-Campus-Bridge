import { Avatar, Box, Flex, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import useGetUserProfileByUserId from "../../../hooks/useGetUserProfileById";

const GetSearchedQuery = ({ query }) => {
  const { userProfile } = useGetUserProfileByUserId(query.uid);
  const [fileContent, setFileContent] = useState('');
 

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      p={4}
      borderBottom="1px solid red"
      borderRadius={10} mb={5}
      background={"#272B35"}
    >
      <VStack spacing={2} alignItems="flex-start" w="full">
        <Box fontSize="sm" width="100%">
          <Link to={`/query/${query.queryId}`} width="100%" ml="auto">
            <Box fontSize="lg" textAlign="justify">{query.queryTitle}</Box>
            <Box fontSize="sm">{query.queryKeywords}</Box>
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
                  <Box fontSize={10}>
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

export default GetSearchedQuery;
