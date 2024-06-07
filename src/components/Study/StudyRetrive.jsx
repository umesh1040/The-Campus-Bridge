import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  VStack,
  StackDivider,
  Text,
  Box, Flex
} from '@chakra-ui/react';  
import { useNavigate  } from 'react-router-dom';

import { addDoc,getDoc,doc, collection, getFirestore,updateDoc,getDocs,query,where } from 'firebase/firestore';
import useShowToast from "../../hooks/useShowToast";

const firestore = getFirestore();


const UploadPDF = () => {
  const showToast = useShowToast();
  const [branch, setBranch] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [resourceType, setResourceType] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [subject, setSubject] = useState('');
 
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState(null); 
   
  const handleBranchChange = async(e) => {
    setBranch(e.target.value); 
      try {
        const docRef = doc(firestore, "resources", e.target.value);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          setSubjects(docSnapshot.data().Subjects); 
        }  
      } catch (error) {
        console.error("Error fetching subjects:", error);
        showToast("Error fetching subjects. Please try again later.", "error");
      }
    setResourceType(''); // Reset resource type when branch changes
    setShowResults(false); // Reset results when branch changes
  };

  const handleSubjectChange = async(e) => {
    setSubject(e.target.value); 
    setShowResults(false); // Reset results when subject changes
    setResourceType(''); 
    setResources([]); 
  };

  const handleResourceTypeChange = async (e) => {
    setLoading(true);
    setResources([]); // Reset resources before fetching new data
    setResourceType(e.target.value);
  
    const matchedSubject = subjects.find((item) => item.subjectName === subject);
  
    if (matchedSubject) {
      try {
        const promises = matchedSubject.resource.map(async (element) => {
          const resourceRef = doc(firestore, 'resource', element);
          const resourceDoc = await getDoc(resourceRef);
          if (resourceDoc.exists() && resourceDoc.data().resourceType === e.target.value) {
            return resourceDoc.data();
          }
          return null; // Return null for resources that don't match the resource type
        });
   
        const resolvedResources = await Promise.all(promises); 
        const filteredResources = resolvedResources.filter((resource) => resource !== null);
        setResources(filteredResources);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    } else { 
    }
    setLoading(false);
  };
  const navigate = useNavigate();

  const toComponentB=(resource)=>{
  navigate('/study/view',{state:{resource:resource}});
  }
  return (
    <Flex gap={5} align="stretch" direction="column">
    <Flex gap={3} direction="row" align="center">
      <FormLabel>Branch</FormLabel>
      <Select
        placeholder="Select Branch"
        value={branch}
        onChange={handleBranchChange}
      >
        <option value="Computer Science and Technology">Computer Science and Technology</option>
        <option value="Chemical Engineering">Chemical Engineering</option>
        <option value="Civil Engineering">Civil Engineering</option>
        <option value="Electronics and Telecommunication Engineering">Electronics and Telecommunication Engineering</option>
        <option value="Food Technology">Food Technology</option>
        <option value="Mechanical Engineering">Mechanical Engineering</option>
      </Select>
    </Flex>
  
    {branch && (
      <Flex gap={2} direction="row" align="center">
        <FormLabel>Subject</FormLabel>
        <Select
          placeholder="Select Subject"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            handleSubjectChange(e); // Call the function handleSubjectChange
          }}
        >
          {subjects?.map(subject => (
            <option key={subject?.subjectId} value={subject?.subjectName}>{subject?.subjectName}</option>
          ))}
        </Select>
      </Flex>
    )}
   
    {subject && (
      <Flex gap={10} direction="row" align="center">
        <Text>Type  </Text>
        <Select
          placeholder="Select Resource Type"
          value={resourceType}
          onChange={handleResourceTypeChange}
        >
          <option value="book">Book</option>
          <option value="roadmap">Roadmap</option>
          <option value="video">Video</option>
        </Select>
      </Flex>
    )}
  
    {loading ? (
      <Text> </Text>
    ) : (
      resources?.map((resource) => (
        <VStack key={resource?.id} p={4} 
        border={"1px solid gray"} borderRadius={10} 
        background={"#272B35"} alignItems="self-start" 
        cursor={"pointer"}
        onClick={(e) => toComponentB(resource)} > 
          <Text as="h1" size="md">
            Title: {resource?.title}
          </Text>
          <Text fontSize={12}>Description: {resource?.description}</Text>
      </VStack>
      ))
    )}
  </Flex>
  
  );
};

export default UploadPDF;
