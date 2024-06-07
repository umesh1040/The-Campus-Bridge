import { Box, Flex, Image, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import GoogleAuth from "./GoogleAuth";
import { Link, useParams } from "react-router-dom";

const AuthForm = () => {
	const { form } = useParams();
	let check=true;
	if(form=="SignUp")
	{
	check=false;
	}
	const [isLogin, setIsLogin] = useState(check);

	return (
		<Box width={{ base: "100%", md: "60%" }}>
			<Box border={"1px solid gray"} borderRadius={4} padding={5} >
				<VStack spacing={4}>
					<Text fontWeight="bold" fontSize="24px">The Campus Bridge</Text>

					{isLogin ? <Login /> : <Signup />}

					<Flex alignItems={"center"} justifyContent={"center"} my={4} gap={1} w={"full"}>
						<Box flex={2} h={"1px"} bg={"gray.400"} />
						<Text mx={1} color={"white"}>
							OR
						</Text>
						<Box flex={2} h={"1px"} bg={"gray.400"} />
					</Flex>
					<GoogleAuth prefix={isLogin ? "Log in" : "Sign up"} />
				</VStack>
			</Box>
			<Box border={"1px solid gray"} borderRadius={4} padding={5}>
				<Flex alignItems={"center"} justifyContent={"center"}>
					<Box mx={2} fontSize={14}>
						{isLogin ? "Don't have an account?" : "Already have an account?"}
					</Box>
					<Box onClick={() => setIsLogin(!isLogin)} color={"blue.500"} cursor={"pointer"}>
						{isLogin ? "Sign up" : "Log in"}
					</Box>
				</Flex>
			</Box>
		</Box>
	);
};

export default AuthForm;
