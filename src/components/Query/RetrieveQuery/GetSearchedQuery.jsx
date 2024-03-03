import { Avatar, Box, Flex, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import useGetUserProfileByUserId from "../../../hooks/useGetUserProfileById";

const GetSearchedQuery = ({ query }) => {
  const { userProfile } = useGetUserProfileByUserId(query.uid);
  const [fileContent, setFileContent] = useState('');
  const formatCreatedAt = (timestamp) => {
    const date = new Date(timestamp);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      p={4}
      borderBottom="1px solid red"
    >
      <VStack spacing={2} alignItems="flex-start" w="full">
        <Box fontSize="sm" width="100%">
          <Link to={`/query/${query.queryId}`} width="100%" ml="auto">
            <Box fontSize="lg" textAlign="justify">{query.queryTitle}</Box>
            <Box fontSize="sm">{query.queryKeywords}</Box>
          </Link>
        </Box>
        <Flex direction={"row"} alignItems="center" w="full">
          <Box fontSize="sm" ml="auto" boxShadow="lg" border="1px solid #ddd" borderRadius={2} p={1}>
            <Flex alignItems="center" gap={2}>
              <Link to={`/${userProfile?.username}`}>
                <Avatar src={userProfile?.profilePicURL} size={"sm"} />
              </Link>
              <VStack spacing={2} alignItems={"flex-start"}>
                <Link to={`/${userProfile?.username}`}>
                  <Box fontSize={16} fontWeight={"bold"}>
                    {userProfile?.fullName}
                  </Box>
                  <Box fontSize={12}>
                    Created: {formatCreatedAt(query.createdAt)}
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
