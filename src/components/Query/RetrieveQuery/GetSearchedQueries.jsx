import { VStack } from "@chakra-ui/react";
import GetSearchedQuery from "./GetSearchedQuery";

const GetSearchedQueries = (queries) => {
	if (!Array.isArray(queries.queries)) {
		console.error("Queries must be an array.");
		return null;
	  }
  return (
    <VStack>
  			{queries.queries.map((query) => (
				<GetSearchedQuery query={query} key={query.id} />
			))}
    </VStack>
  );
};

export default GetSearchedQueries;
