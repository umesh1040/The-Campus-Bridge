import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  VStack,
  Progress,
  Checkbox,
} from '@chakra-ui/react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { storage } from '../../firebase/firebase';
import useShowToast from "../../hooks/useShowToast";

const firestore = getFirestore();

const UploadPDF = () => {
  const showToast = useShowToast();
  const [branch, setBranch] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isRoadmap, setIsRoadmap] = useState(false); 

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {

    if (!branch || !title || !description || !pdfFile) {
      showToast("Error", "All fields are required", "error");
      return;
    }

    const storagePath = isRoadmap
      ? `roadmap/${branch}/${pdfFile.name}`
      : `resources/${branch}/${pdfFile.name}`;

    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, pdfFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
      showToast("Error", "Failed to upload", "error");
      },
      async () => {
        const pdfURL = await getDownloadURL(uploadTask.snapshot.ref);

        const collectionPath = isRoadmap ? 'roadmap' : 'resources';
        const resourcesCollection = collection(firestore, collectionPath);

        await addDoc(resourcesCollection, {
          branch,
          title,
          description,
          pdfURL,
        });
        
        showToast("Success", "Resource uploaded successfully", "success");
        setUploadProgress(0);
      }
    );
  };

  return (
    <VStack spacing={4} align="stretch" mt={50}>
      <FormControl>
        <FormLabel>Branch</FormLabel>
        <Select
          placeholder="Select Branch"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
            <option value="Computer Science and Technology">Computer Science and Technology</option>
          <option value="Chemical Engineering">Chemical Engineering</option>
          <option value="Civil Engineering">Civil Engineering</option>
          <option value="Electronics and Telecommunication Engineering">
            Electronics and Telecommunication Engineering
          </option>
          <option value="Food Technology">Food Technology</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
       
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Title</FormLabel>
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Upload PDF</FormLabel>
        <Input type="file" onChange={handleFileChange} />
      </FormControl>

      <Checkbox isChecked={isRoadmap} onChange={() => setIsRoadmap(!isRoadmap)}>
        Upload as Roadmap
      </Checkbox>

      {uploadProgress > 0 && (
        <Progress
          value={uploadProgress}
          size="sm"
          colorScheme="teal"
          mt={2}
          borderRadius={4}
        />
      )}

      <Button colorScheme="teal" onClick={handleUpload} mt={2}>
        Upload PDF
      </Button>
    </VStack>
  );
};

export default UploadPDF;
