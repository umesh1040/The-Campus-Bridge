import { Box, Flex, Link, Text, VStack } from "@chakra-ui/react";

import GetAnswer from "./GetAnswer";
import useGetQuery from "../../../hooks/useGetQuery";

const GetAnswers = (type) => {
  const { isLoading, Query } = useGetQuery(type);
  if (isLoading) return null;

  return (
    <Flex
      py={8}
      px={1}
      gap={4}
      align="center" 
      direction="column" 
      w={{ base: "70px",  md: "241px", justifyContent:"center"}}
    
    >
      {Query.map((query) => (
        <GetAnswer query={query} key={query.id} />
      ))}
    </Flex>
  );
};

export default GetAnswers;
