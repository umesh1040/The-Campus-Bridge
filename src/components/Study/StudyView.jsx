import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Container
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

const DisplayPDF = () => {
  const location = useLocation();
  const { resource } = location?.state;
 
  return (
    <Container maxW={"container.lg"} justifyContent="center" alignItems="center" mt={{base:180, md:150}}   > 
    <Box p={1}   width={{ base: "100%", md: "600px", lg: "860px" }} height={"95vh"} justifyContent={"center"} alignContent={"center"}>
    <Text mt={{ base: 55, md: 1, lg: 1 }} fontSize={"24px"}>Title: {resource.title}</Text>  
    {resource.resourceType === "video" ? ( 
      <Box width="100%" height="100%">
          <iframe
            src={resource.linkURL}
            width="100%"
            height="100%"
            allowFullScreen
          /> 
      </Box>
      ) : (
        <Box width="100%" height="100%">
          <iframe
            title="PDF Viewer"
            src={resource.pdfURL}
            width="100%"
            height="100%"
          />
        </Box>
      )}
      
      <Text fontSize={"16px"} textAlign={"justify"} paddingBottom={50} >Description: {resource.description}</Text>  
    </Box>
    </Container>
  );
};

export default DisplayPDF;
