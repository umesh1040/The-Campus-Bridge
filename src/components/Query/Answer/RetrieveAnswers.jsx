import { Box, Flex, Link, Text, VStack } from "@chakra-ui/react";

import RetrieveAnswer from "./RetrieveAnswer";
import useGetQuery from "../../../hooks/useGetQuery";

const RetrieveAnswers = (type) => {
	const { isLoading, Query } = useGetQuery(type);


	if (isLoading) return null;

	return (
		<VStack py={1} px={1} gap={4}>
			{Query.length > 0 ? (
				Query.map((query) => (
					<RetrieveAnswer query={query} key={query.id} />
				))
			) : (
				<Box fontSize="lg" textAlign="center">
					No answers yet.
				</Box>
			)}
		</VStack>
	);
};

export default RetrieveAnswers;
