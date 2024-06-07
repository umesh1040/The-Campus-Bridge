import { Avatar, Box, Flex, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import GetQueries from "../GetQueries";

const GetAnswer = ({ query }) => {
  return (
    <Box textAlign="left" width="100%">
    <Link to={`/query/${query.queryId}`}>
        <GetQueries type={"Query"} Id={query.queryId} />
    </Link>
    </Box>
  );
};

export default GetAnswer;
