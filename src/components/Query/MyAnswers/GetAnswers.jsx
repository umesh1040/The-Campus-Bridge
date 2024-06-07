import { Box, Flex, Link, Text, VStack } from "@chakra-ui/react";

import GetAnswer from "./GetAnswer";
import useGetQuery from "../../../hooks/useGetQuery";

const GetAnswers = (type) => { 
	const { isLoading, Query } = useGetQuery(type);
	if (isLoading) return null; 
	return (
		<VStack  gap={1}>
			{Query.map((query) => (
				<GetAnswer query={query} key={query.id} />
			))}
		</VStack>
	);
};
export default GetAnswers;
