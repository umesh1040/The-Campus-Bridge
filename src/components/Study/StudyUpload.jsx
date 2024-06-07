import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  VStack,
} from '@chakra-ui/react'; 
import { storage } from '../../firebase/firebase';

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc,getDoc,doc, collection, getFirestore,updateDoc } from 'firebase/firestore';
import useShowToast from "../../hooks/useShowToast";
import AddSubject from './AddSubject';

const firestore = getFirestore();

const UploadPDF = () => {
  const showToast = useShowToast();
  const [branch, setBranch] = useState('');
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resourceType, setResourceType] = useState('');
  const [linkURL, setLinkURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    branch: false,
    subject: false,
    title: false,
    description: false,
    pdfFile: false,
    linkURL: false,
  });

  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchSubjects();
  }, [branch]);

  const fetchSubjects = async () => {
    if (branch !== '') {
      try {
        const docRef = doc(firestore, "resources", branch);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          setSubjects(docSnapshot.data().Subjects);
        }  
      } catch (error) {
        console.error("Error fetching subjects:", error);
        showToast("Error fetching subjects. Please try again later.", "error");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);
    // Form validation
    let valid = true;
    const newErrors = { ...formErrors };
  
    if (!branch) {
      newErrors.branch = true;
      valid = false;
    }
  
    if (!subject) {
      newErrors.subject = true;
      valid = false;
    }
  
    if (!title) {
      newErrors.title = true;
      valid = false;
    }
  
    if (!description) {
      newErrors.description = true;
      valid = false;
    }
  
    if (resourceType !== "video" && !pdfFile) {
      newErrors.pdfFile = true;
      valid = false;
    }
  
    if (resourceType === "video" && !linkURL) {
      newErrors.linkURL = true;
      valid = false;
    }
  
    if (!valid) {
      setFormErrors(newErrors);
      
      setIsLoading(false);
      return; // Exit early if form is not valid
    }
  
    try {
      let pdfURL = "";
  
      if (pdfFile) {
        const storagePath = resourceType === "book"
          ? `resources/${branch}/${subject}/${pdfFile.name}`
          : `roadmap/${branch}/${subject}/${pdfFile.name}`;
  
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, pdfFile);
  
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Error uploading PDF:", error);
            showToast("Error uploading PDF. Please try again later.", "error");
          },
          async () => {
            try {
              pdfURL = await getDownloadURL(uploadTask.snapshot.ref);
              await insertDataIntoFirestore(pdfURL);
            } catch (error) {
              console.error("Error getting PDF URL:", error);
              showToast("Error getting PDF URL. Please try again later.", "error");
            }
          }
        );
      } else {
        await insertDataIntoFirestore(pdfURL);
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      showToast("Error uploading PDF. Please try again later.", "error");
    }
  };
  
  const insertDataIntoFirestore = async (pdfURL) => {
    try {
      const collectionPath = `resource`;
      const resourcesCollection = collection(firestore, collectionPath);
  
      const newResourceDoc = await addDoc(resourcesCollection, { 
        title,
        description,
        resourceType,
        pdfURL,
        linkURL: resourceType === "video" ? linkURL : "",
      });
  
      const docRef = doc(firestore, "resources", branch);
      const docSnapshot = await getDoc(docRef);
      
      if (docSnapshot.exists()) {
        const subjectsArray = docSnapshot.data().Subjects;
        const updatedSubjectsArray = subjectsArray.map(subjectObj => {
          if (subjectObj.subjectName === subject) {
            return {
              ...subjectObj,
              resource: [...subjectObj.resource, newResourceDoc.id]
            };
          }
          return subjectObj;
        });
  
        await updateDoc(docRef, {
          Subjects: updatedSubjectsArray
        });
      }
  
      showToast("Success", "Resource uploaded successfully", "success");
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error inserting data into Firestore:", error);
      showToast("Error inserting data into Firestore. Please try again later.", "error");
    }
  };
  

  return (
    <VStack spacing={4} align="stretch" mt={50}>
      <FormControl isInvalid={formErrors.branch}>
        <FormLabel>Branch</FormLabel>
        <Select
          placeholder="Select Branch"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          <option value="Computer Science and Technology">Computer Science and Technology</option>
          <option value="Chemical Engineering">Chemical Engineering</option>
          <option value="Civil Engineering">Civil Engineering</option>
          <option value="Electronics and Telecommunication Engineering">Electronics and Telecommunication Engineering</option>
          <option value="Food Technology">Food Technology</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
        </Select>
        {formErrors.branch && <span style={{ color: "red" }}>Please select a branch.</span>}
      </FormControl>

      <FormControl isInvalid={formErrors.subject}>
        <FormLabel>Subject</FormLabel>
        <Select
          placeholder="Select Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          {subjects?.map(subject => (
            <option key={subject?.subjectId} value={subject?.subjectName}>{subject?.subjectName}</option>
          ))}
        </Select>
        {formErrors.subject && <span style={{ color: "red" }}>Please select a subject.</span>}
      </FormControl>

      <FormControl isInvalid={formErrors.title}>
        <FormLabel>Title</FormLabel>
        <Input
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {formErrors.title && <span style={{ color: "red" }}>Please enter a title.</span>}
      </FormControl>

      <FormControl>
        <FormLabel>Resource Type</FormLabel>
        <Select
          placeholder="Select Resource Type"
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
        >
          <option value="book">Book</option>
          <option value="roadmap">Roadmap</option>
          <option value="video">Video</option>
        </Select>
      </FormControl>

      {resourceType === "video" && (
        <FormControl isInvalid={formErrors.linkURL}>
          <FormLabel>Link URL</FormLabel>
          <Input
            type="text"
            value={linkURL}
            onChange={(e) => setLinkURL(e.target.value)}
          />
          {formErrors.linkURL && <span style={{ color: "red" }}>Please enter a link URL.</span>}
        </FormControl>
      )}

      <FormControl isInvalid={formErrors.description}>
        <FormLabel>Description</FormLabel>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {formErrors.description && <span style={{ color: "red" }}>Please enter a description.</span>}
      </FormControl>

      {resourceType !== "video" && (
        <FormControl isInvalid={formErrors.pdfFile}>
          <FormLabel>Upload PDF</FormLabel>
          <Input type="file" onChange={handleFileChange} />
          {formErrors.pdfFile && <span style={{ color: "red" }}>Please upload a PDF file.</span>}
        </FormControl>
      )}

      <Button colorScheme="teal" onClick={handleUpload} mt={2} 
				isLoading={isLoading}>
        Upload PDF
      </Button>
      <AddSubject />
    </VStack>
  );
};

export default UploadPDF;
