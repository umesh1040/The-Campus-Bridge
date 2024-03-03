import { Container, Flex, VStack, Box, Image, Text } from "@chakra-ui/react";
import AuthForm from "../../components/AuthForm/AuthForm";

const AuthPage = () => {
  return (
    <Flex minH={"100vh"} justifyContent={"center"} alignItems={"center"} px={4} mt={110}>
      <Container maxW={"container.md"} padding={0} >
        <Flex justifyContent={"center"} alignItems={"center"} gap={200}>
          <Box flex={2} maxW={200} display={{ base: "none", md: "block" }} textAlign={"center"}>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="4xl" fontWeight="extralight" display="flex" pt={-75}>
                The Campus Bridge 
              </Text>
			  <Text fontSize="4xl" fontWeight="extralight" display="flex" pt={100}>
                Join the   new
              </Text>
              <Text fontSize="5xl" fontWeight="extrabold" pt="4">
                Era of learning
              </Text>
            </Flex>
          </Box>

          <VStack spacing={4} align={"stretch"} flex={1}>
            <AuthForm />
            <Box textAlign={"center"} fontSize="lg" fontWeight="bold">
              Get the app.
            </Box>
            <Flex gap={5} justifyContent={"center"}>
              <Image src='/playstore.png' h={"10"} alt='Playstore logo' />
            </Flex>
          </VStack>
        </Flex>
      </Container>
    </Flex>
  );
};

export default AuthPage;
