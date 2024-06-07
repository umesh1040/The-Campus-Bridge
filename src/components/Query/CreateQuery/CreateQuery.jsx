
import {FormControl,FormLabel,Input, Button, Box,Flex} from '@chakra-ui/react';
import useCreateQuery from "../../../hooks/useCreateQuery";

import React, { useState, useRef, useEffect, } from 'react';
import JoditEditor from 'jodit-react';
import "../index.css"


const CreateQuery = ({ placeholder }) => {
  const editor = useRef(null);
  const [inputs, setInputs] = useState({
    content: "",
    title: "",
    keywords:"",
});
const { isLoading, setIsLoading, error, create } = useCreateQuery();

const handleCreate = async () => {
  setIsLoading(true);
  const editorContent = editor.current.value;
  try {
    setInputs({ ...inputs, content: editorContent });
    await create(inputs);
  } catch (error) {
    console.error('Error creating query:', error);
  } finally {
    setIsLoading(false);
  }
};


  const config = {
    readonly: false,
    placeholder: placeholder || 'Start typing...',
    uploader: {
      insertImageAsBase64URI: true,
      imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
      withCredentials: false,
      format: 'json',
      method: 'POST',
      url: '*',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      prepareData: function (data) {
        data.append('file', this.file);
        return data;
      },
      isSuccess: function (resp) {
        return !resp.error;
      },
      getMsg: function (resp) {
        return resp.msg.join !== undefined ? resp.msg.join(' ') : resp.msg;
      },
      process: function (resp) {
        return {
          files: [resp.data],
          path: '',
          baseurl: '',
          error: resp.error ? 1 : 0,
          msg: resp.msg,
        };
      },
      defaultHandlerSuccess: function (data, resp) {
        const files = data.files || [];
        if (files.length) {
          const imageUrl = files[0];

          const imageHtml = `<img src="${imageUrl}" alt="Uploaded Image" />`;
          this.selection.insertHTML(imageHtml);
        }
      },
      defaultHandlerError: function (resp) {
        this.events.fire('errorPopap', this.i18n(resp.msg));
      },
    },
    resize: "vertical",
    toolbarAdaptive: false, 
    buttons: ['source', '|', 'bold', 'italic', 'underline', '|', 'ul', 'ol', '|', '|', '|', 'undo', 'redo', '|', 'align', 'table', 'link', 'image'],
    events: {
      onTouchMove: (e) => e.preventDefault(),
    },
  };

  return (
    <Box ml={-5} mr={-5}>
          <FormControl mb={4} isRequired>
            <FormLabel htmlFor="questionTitle">Question Title:</FormLabel>
            <Input
              type="text"
              id="questionTitle"
              name="questionTitle"
              value={inputs.title}
              onChange={(e) => setInputs({ ...inputs, title: e.target.value })}
            />
          </FormControl>
   
          <FormControl mb={4} isRequired>
            <FormLabel htmlFor="tags">Tags:</FormLabel>
             <Input
              type="text"
              id="tags"
              name="tags"
              value={inputs.keywords}
              onChange={(e) => setInputs({ ...inputs, keywords: e.target.value })}
        
            />
          </FormControl>
          
            <JoditEditor 
                ref={editor}
                config={config}
                tabIndex={1}
                value={inputs.content}
            />
           <Flex direction={"row"}>
           <Button onClick={handleCreate} colorScheme="teal" mt={4} isLoading={isLoading}>
             Ask Question
           </Button>
 
           </Flex>
           </Box  >
  );
};

export default CreateQuery;
