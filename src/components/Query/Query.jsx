import { Box, Button, Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import CreateQuery from "./CreateQuery/CreateQuery";
import RetrieveQuery from "./RetrieveQuery/RetrieveQuery";
import RetrieveMyQuery from "./MyQueries/RetrieveMyQuery";
import RetrieveMyAnswer from "./MyAnswers/RetrieveMyAnswers";
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const FeedTab1 = () => <div><RetrieveQuery/></div>;
const FeedTab2 = () => <div><CreateQuery/></div>;
const FeedTab3 = () => <div><RetrieveMyQuery/></div>;
const FeedTab4 = () => <div><RetrieveMyAnswer/></div>;

const YourPageWithButtons = ({ feed = 0 }) => {
  const [selectedTab, setSelectedTab] = useState(feed);
  const [authUser] = useAuthState(auth);
  const navigate = useNavigate();
  
  if (!authUser) {
    navigate("/auth");
    return null;
  }
  
  const handleButtonClick = (tabIndex) => {
    setSelectedTab(tabIndex);
  };

  return (
    <Box p={1} width="100%">
      <Flex display="flex" justifyContent="center" mb={5} gap={{ base: 1, md: 20}}>
        <Button
          width={{ base: "75px", md: "115px" }}
          borderColor={selectedTab === 0 ? "green.300" : ""}
          bg={selectedTab === 0 ? "gray.800" : "transparent"}
          borderWidth="2px"
          fontSize={{ base: 12, md: 16 }}
          onClick={() => handleButtonClick(0)}
        >
          Query
        </Button>
        <Button
          width={{ base: "80px", md: "115px" }}
          borderColor={selectedTab === 1 ? "green.300" : ""}
          bg={selectedTab === 1 ? "gray.800" : "transparent"}
          borderWidth="2px"
          fontSize={{ base: 12, md: 16 }}
          onClick={() => handleButtonClick(1)}
        >
          Create Query
        </Button>
        <Button
          width={{ base: "75px", md: "115px" }}
          borderColor={selectedTab === 2 ? "green.300" : ""}
          bg={selectedTab === 2 ? "gray.800" : "transparent"}
          borderWidth="2px"
          fontSize={{ base: 12, md: 16 }}
          onClick={() => handleButtonClick(2)}
        >
          My Query
        </Button>
        <Button
          width={{ base: "75px", md: "115px" }}
          borderColor={selectedTab === 3 ? "green.300" : ""}
          borderWidth="2px"
          bg={selectedTab === 3 ? "gray.800" : "transparent"}
          fontSize={{ base: 12, md: 16 }}
          onClick={() => handleButtonClick(3)}
        >
          My Answer
        </Button>
      </Flex>

      {selectedTab === 0 && <FeedTab1 />}
      {selectedTab === 1 && <FeedTab2 />}
      {selectedTab === 2 && <FeedTab3 />}
      {selectedTab === 3 && <FeedTab4 />}
    </Box>
  );
};

export default YourPageWithButtons;
