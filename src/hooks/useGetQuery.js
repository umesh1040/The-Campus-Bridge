import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetQuery = (type) => {
  const [isLoading, setIsLoading] = useState(true);
  const [Query, setQuery] = useState([]);
  const authUser = useAuthStore((state) => state.user);
  const showToast = useShowToast();
 
  useEffect(() => {
    const getQuery = async () => {
      setIsLoading(true);
      let usersRef = collection(firestore, "query"); 
      let q = query(usersRef,orderBy("createdAt", "desc"));
      try {
        if (type.type == "myAnswer") { 
          usersRef = collection(firestore, "answer");
          q = query(usersRef, where("uid", "==", type.Id), orderBy("createdAt", "desc"));
        }

        if (type.type == "myQuery") { 
          q = query(usersRef, where("uid", "==", type.Id), orderBy("createdAt", "desc"));
        }

        if (type.type == "Query") { 
          q = query(usersRef, where("queryId", "==", type.Id), orderBy("createdAt", "desc"));
        }

        if (type.type == "answer") { 
          usersRef = collection(firestore, `answer`);
          q = query(usersRef, where("queryId", "==", type.Id), orderBy("createdAt", "desc"));
        }
        console.log(type.type);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const users = [];
          querySnapshot.forEach((doc) => {
            users.push({ ...doc.data(), id: doc.id });
          });
          setQuery(users);
        }); 
        return () => unsubscribe();
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (authUser) getQuery();
  }, [authUser, showToast, type]);

  return { isLoading, Query };
};

export default useGetQuery;