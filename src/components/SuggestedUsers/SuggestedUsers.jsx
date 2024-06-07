import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import SuggestedHeader from "./SuggestedHeader";
import SuggestedUser from "./SuggestedUser";
import useGetSuggestedUsers from "../../hooks/useGetSuggestedUsers";

const SuggestedUsers = ({ user  }) => {
  const { isLoading, suggestedUsers } = useGetSuggestedUsers(); 
  if (isLoading) return null;

  return (
    <VStack py={8} px={6} gap={4}>
     {!user&&
        <Box gap={5} maxH={"500px"} overflowY={"scroll"}>
          <SuggestedHeader />
          <Flex alignItems={"center"} justifyContent={"space-between"} w={"full"} gap={50}>
            <Text fontSize={12} fontWeight={"bold"} color={"gray.500"}>
              Suggested for you
            </Text>
            {/* <Text fontSize={12} fontWeight={"bold"} _hover={{ color: "gray.400" }} cursor={"pointer"} mr={5}>
              See All
            </Text> */}
          </Flex>
          {suggestedUsers.length !== 0 && !user ? (
		    <Flex alignItems={"center"} justifyContent={"space-between"}direction={"column"} gap={2}>
          {suggestedUsers?.map((user) => (
            <SuggestedUser user={user} key={user.id} />
          ))}

		    </Flex>
          ):
          <Text fontSize={12} fontWeight={"bold"} >No suggestion</Text>
          }
        </Box>
}
        {user?.length !== 0 && (
          <Flex gap={5} direction={"column"}>
        {user?.map((user) => (
            <SuggestedUser user={user} key={user.id} />
          ))}
      </Flex>
      )}
    </VStack>
  );
};

export default SuggestedUsers;
