import { Box, Text, Input, InputGroup } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import GetQueries from "../GetQueries";
import SearchBar from "./SearchBar";
const QueryDetails = ({ queryId = 1 }) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
  }, [searchQuery]);

  return (
    <Box ml={-5} mr={-5}>
      <SearchBar/>
        <GetQueries type={"all"} Id={queryId} />
    </Box>
  );
};

export default QueryDetails;
