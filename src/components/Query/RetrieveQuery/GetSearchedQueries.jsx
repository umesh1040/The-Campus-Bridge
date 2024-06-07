import { VStack,Box } from "@chakra-ui/react";
import GetSearchedQuery from "./GetSearchedQuery";

const GetSearchedQueries = (queries) => {
	if (!Array.isArray(queries.queries)) {
		console.error("Queries must be an array.");
		return null;
	  }
  return (
    <VStack>
		{queries.queries.length > 0 && <VStack width={"full"}>
  			{queries.queries.map((query) => (
				<GetSearchedQuery query={query} key={query.id} />
			))}
		</VStack>}
    </VStack>
  );
};

export default GetSearchedQueries;
