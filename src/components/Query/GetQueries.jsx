import {  VStack } from "@chakra-ui/react";

import GetQuery from "./GetQuery";
import useGetQuery from "../../hooks/useGetQuery";

const GetQueries = (type) => {
	const { isLoading, Query } = useGetQuery(type);
	if (isLoading) return null; 
	return (
		<VStack >
			{Query.map((query) => (
				<GetQuery query={query} key={query.id} />
			))}
		</VStack>
	);
};

export default GetQueries;
