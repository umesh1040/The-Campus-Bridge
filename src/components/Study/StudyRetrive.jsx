import React, { useEffect, useState } from 'react';
import {
  Box,
  Select,
  VStack,
} from '@chakra-ui/react';
import {
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';

const DisplayPDF = (path) => {
  const [branch, setBranch] = useState('');
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [pdfURL, setPdfURL] = useState('');

  useEffect(() => {
    const fetchTitles = async () => {
      if (branch) {
        const titlesQuery = query(collection(firestore, `${path.path}`), where('branch', '==', branch));

        const unsubscribe = onSnapshot(titlesQuery, (snapshot) => {
          const titlesList = snapshot.docs.map((doc) => doc.data().title);
          setTitles(titlesList);
        });

        return () => unsubscribe(); 
      }
    };

    fetchTitles(); 

  }, [branch]); 

  useEffect(() => {
    const fetchPdfURL = async () => {
      if (branch && selectedTitle) {
        const resourceQuery = query(
          collection(firestore, `${path.path}`),
          where('branch', '==', branch),
          where('title', '==', selectedTitle)
        );

        const unsubscribe = onSnapshot(resourceQuery, (snapshot) => {
          if (snapshot.docs.length > 0) {
            const pdfURL = snapshot.docs[0].data().pdfURL;
            setPdfURL(pdfURL);
          } else {
            setPdfURL('');
          }
        });

        return () => unsubscribe(); 
      }
    };

    fetchPdfURL(); 

  }, [branch, selectedTitle]); 

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
    setSelectedTitle('');
    setPdfURL('');
  };

  const handleTitleChange = (e) => {
    setSelectedTitle(e.target.value);
  };

  return (
    <VStack p={4} spacing={4} align="center" mt={1} width="100%" >
      <Select
        value={branch}
        onChange={handleBranchChange}
      >
        <option value="">Select Branch</option>
        <option value="Computer Science and Technology">Computer Science and Technology</option>
        <option value="Chemical Engineering">Chemical Engineering</option>
        <option value="Civil Engineering">Civil Engineering</option>
        <option value="Electronics and Telecommunication Engineering">Electronics and Telecommunication Engineering</option>
        <option value="Food Technology">Food Technology</option>
        <option value="Mechanical Engineering">Mechanical Engineering</option>
      </Select>

      <Select
        placeholder="Select Title"
        value={selectedTitle}
        onChange={handleTitleChange}
      >
        {titles.map((title) => (
          <option key={title} value={title}>
            {title}
          </option>
        ))}
      </Select>

      {pdfURL && (
        <Box mb={1} height="100vh" width={"100%"}>
          <iframe
            title="PDF Viewer"
            src={pdfURL}
            width="100%"
            height="100%"
          />
        </Box>
      )}
    </VStack>
  );
};

export default DisplayPDF;
