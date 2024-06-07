import { useState } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getFirestore, collection,orderBy, query, where,getDocs,and,Timestamp } from "firebase/firestore";
import { storage } from "../firebase/firebase"; 
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";

const useCreateAnswer= () => {
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useShowToast();
  const authUser = useAuthStore((state) => state.user);
  const firestore = getFirestore(); 
	const [queries, setQuery] = useState(null);

  const create = async (inputs) => {
		setQuery(null);

    if (!inputs.content || !inputs.queryId || inputs.content=="<p><br></p>") {
      showToast("Error", "Please fill all the fields", "error");
      return;
    }

    try {
      setIsLoading(true);
      const queryCollectionRef = collection(firestore, "answer");
      const newAnswerRef = doc(queryCollectionRef);

      const storageReff = ref(storage, `answer/${inputs.queryId}/${authUser.uid}.txt`);

      await uploadString(storageReff, inputs.content, 'raw');
      const downloadUrl = await getDownloadURL(storageReff);

			const usersRef = collection(firestore, "answer/"); 
      const q = query(usersRef, and(where("uid" , "==", authUser.uid), where("queryId", "==", inputs.queryId) )); 
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty){
        var retrievedAnswerId="";
        querySnapshot.forEach((doc) => { 
          retrievedAnswerId= doc.data().answerId;
				});
        
        const updatedData = {
          modifiedAt:  Timestamp.now(),
          downloadUrl: downloadUrl,
        };
  
        await setDoc(doc(queryCollectionRef, retrievedAnswerId), updatedData, { merge: true });
        showToast("Success", "Answer Updated successfully", "success");
      }
      else{
        const userDoc = {
          answerContents: downloadUrl,
          answerId: newAnswerRef.id,
          uid: authUser.uid,
          queryId: inputs.queryId,
          createdAt:  Timestamp.now(),
          upVote: [],
          downVote: [],
          modifiedAt: []
        };
        await setDoc(newAnswerRef, userDoc);
        showToast("Success", "Answer Submitted successfully", "success");
    }

    } catch (error) {
      console.error('Error uploading file to Firebase Storage:', error);
      showToast("Error", "Failed to create query", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, setIsLoading, create };
};

export default useCreateAnswer;
