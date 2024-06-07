import { Container, Flex, VStack, Box, Image, Text } from "@chakra-ui/react";
import AuthForm from "../../components/AuthForm/AuthForm";

const AuthPage = () => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"   
      mt={10}
    >
      <Container maxW="container.md" padding={0}>
        <VStack spacing={4} align="center" alignContent={"center"} alignItems={"center"}>
          <AuthForm />
          <Box textAlign="center" fontSize="lg" fontWeight="bold" alignContent={"center"} >
            Get the app.
            <Image src="/playstore.png" h="10" alt="Playstore logo" /> 
            
          </Box> 
        </VStack>
      </Container>
    </Flex>
  );
};

export default AuthPage;
