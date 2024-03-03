
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
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

const YourPageWithTabs = ({ feed = 0 }) => {
  const [selectedTab, setSelectedTab] = useState(feed);
  const [authUser] = useAuthState(auth);
  const navigate = useNavigate();
  if(!authUser){
		navigate("/auth");
		return null;
	}
  return (
    <Box p={1} mt={-50} width="100%">
      <Tabs isFitted variant="enclosed">
        <TabList >
          <Tab onClick={() => setSelectedTab(0)}>Query</Tab>
          <Tab onClick={() => setSelectedTab(1)}>Create Query</Tab>
          <Tab onClick={() => setSelectedTab(2)}>My Query</Tab>
          <Tab onClick={() => setSelectedTab(3)}>My Answer</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>{selectedTab === 0 && <FeedTab1 />}</TabPanel>
          <TabPanel>{selectedTab === 1 && <FeedTab2 />}</TabPanel>
          <TabPanel>{selectedTab === 2 && <FeedTab3 />}</TabPanel>
          <TabPanel>{selectedTab === 3 && <FeedTab4 />}</TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default YourPageWithTabs;
