import { Box, Flex, Input, InputGroup, Button } from '@chakra-ui/react';
import { useState, useRef } from 'react';
import useSearchQuery from "../../../hooks/useSearchQuery";
import GetSearchedQueries from "./GetSearchedQueries";

const QueryDetails = ({ queryId = 1 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  const { isLoading, getSearchedQuery, queries,setQueries } = useSearchQuery();

  const handleSearchQuery = (e) => {
    e.preventDefault();
    const queryValue = searchRef.current.value.trim(); // Trim any whitespace
    setSearchQuery(queryValue); // Update searchQuery state
    if (!queryValue) {
      // showToast("Error", "Query not found", "error");
    } else {
      getSearchedQuery(queryValue);
    }
  };
  const handleCheckQuery = (e) => {
    e.preventDefault();
    const queryValue = searchRef.current.value.trim(); // Trim any whitespace
    setSearchQuery(queryValue); // Update searchQuery state
    if (!queryValue) {
      setQueries(null); 
    }
  };

  return (
    <Box>
      <Flex direction="column" justifyContent="center" alignItems="center">
        <InputGroup mb={4} dir='row' w="100%">
          <form onSubmit={handleSearchQuery} style={{ width: '100%' }}>
            <Flex direction="row" w="100%" justifyContent="center" gap={2}>
              <Input
                size="sm"
                placeholder="Search queries..."
                ref={searchRef} 
                w="100%"
                onChange={handleCheckQuery} 
              />
              <Button type="submit" ml="auto" size="sm">
                Search
              </Button>
            </Flex>
          </form>
        </InputGroup>
      </Flex>
      {/* Conditionally render GetSearchedQueries based on searchQuery */}
      {searchQuery && !isLoading && <GetSearchedQueries queries={queries} />}
    </Box>
  );
};

export default QueryDetails;
