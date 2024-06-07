import React, { useContext, useState } from "react";
import { Button, Flex, Textarea, Text, Image,Progress } from "@chakra-ui/react"; // Import Chakra UI components
import Img from "../../../assets/img/img.png";
import cam from "../../../assets/img/cam.png";
import attach from "../../../assets/img/attach.png";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,setDoc,
} from "firebase/firestore";
import { firestore, storage } from "../../../firebase/firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";


import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContextGroup";

const Input = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const handleSend = async () => {
    if(file==null&&text==""){
      return;
    }
    if (file) {
      const storageRef = ref(storage,  `Groupchats/${data.chatId}/${uuid()}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            let messageType;
            if (file.type.startsWith("image/")) {
              messageType = "img";
            } else if (file.type.startsWith("video/")) {
              messageType = "video";
            } else if (file.type.startsWith("application/pdf")) {
              messageType = "pdf";
            }

            await updateDoc(doc(firestore, "Groupchats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                [messageType]: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(firestore, "Groupchats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    try{
      const groupRef = doc(firestore, "GroupChat", data.chatId);
      await updateDoc(groupRef, {
        "lastMessage": text,
        "date":serverTimestamp()
      });
  }catch(e){}


    setText("");
    setFile(null);
    setFilePreview(null);
    setUploadProgress(0);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (
        selectedFile.type.startsWith("image/") ||
        selectedFile.type.startsWith("video/") ||
        selectedFile.type.startsWith("application/pdf")
      ) {
        setFile(selectedFile);
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        console.error(
          "Unsupported file type. Please select an image, video, or PDF file."
        );
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  return (
    <Flex direction={"column"}>
          {uploadProgress > 0 && uploadProgress < 100 && (
        <Progress size='sm' height={"2px"}  colorScheme='green' value={uploadProgress} />  
      )}
    <Flex justifyContent="space-between" alignItems="center" padding="10px" gap={2} >
    <Textarea
      height={"auto"}
      value={text}
      border="1px solid #a7bcff"
      type="text"
      placeholder="Type something..."
      onChange={(e) => setText(e.target.value)}
      width= '100%'
      overflowY= 'auto'
      maxHeight={20}
      scrollbarWidth= 'thin' css={{ scrollbarWidth: 'thin' }}    />
   
      <Flex alignItems="center" gap={2}>
        <label htmlFor="file">
          <Image src={attach} alt="" />
        </label>
        <input
          type="file"
          accept="image/*,video/*,application/pdf"
          id="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
           {filePreview && (
        <Flex flexDirection="column" alignItems="flex-end">
          <Text
            fontSize="10"
            width="80%"
            cursor="pointer"
            onClick={handleRemoveFile}
          >
            x
          </Text>
          <Flex >
            {file.type.startsWith("image/") && (
              <Image
                src={filePreview}
                alt="Attached Preview"
                height="20px"
                onClick={handleRemoveFile}
              />
            )}
            {file.type.startsWith("video/") && (
              <Image
                src={cam}
                alt="Attached Preview"
                height="20px"
                onClick={handleRemoveFile}
              />
            )}
            {file.type.startsWith("application/pdf") && (
              <Image
                src={attach}
                alt="Attached Preview"
                height="20px"
                onClick={handleRemoveFile}
              />
            )}
          </Flex>
        </Flex>
      )}

        <Button onClick={handleSend} backgroundColor="#8da4f1" color="white">
          Send
        </Button>
      </Flex>
    </Flex>
    </Flex>
  );
};

export default Input;

