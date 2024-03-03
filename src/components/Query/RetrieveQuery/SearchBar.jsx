import { Box, Flex, Input, InputGroup, Button } from '@chakra-ui/react';
import { useState, useRef } from 'react';
import useSearchQuery from "../../../hooks/useSearchQuery";
import GetSearchedQueries from "./GetSearchedQueries";

const QueryDetails = ({ queryId = 1 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  const { isLoading, getSearchedQuery, queries } = useSearchQuery();

  const handleSearchUser = (e) => {
    e.preventDefault();
    if ((searchRef.current.value).empty){
      showToast("Error", "Query not found", "error");
    }
    else {
    getSearchedQuery(searchRef.current.value);
  }
  };

  return (
    <Box>
      <Flex direction="column" justifyContent="center" alignItems="center">
        <InputGroup mb={4} dir='row' w="100%">
          <form onSubmit={handleSearchUser} style={{ width: '100%' }}>
            <Flex direction="row" w="100%" justifyContent="center" gap={2}>
              <Input
                size="sm"
                placeholder="Search queries..."
                ref={searchRef}
                w="100%"
              />
              <Button type="submit" ml="auto" size="sm">
                Search
              </Button>
            </Flex>
          </form>
        </InputGroup>
      </Flex>
      {!isLoading && <GetSearchedQueries queries={queries}  />}
    </Box>
  );
};

export default QueryDetails;
