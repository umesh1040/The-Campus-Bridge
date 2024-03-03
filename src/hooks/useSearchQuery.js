import { useState } from "react";
import useShowToast from "./useShowToast";
import { collection, getDocs, query } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useSearchQuery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [queries, setQueries] = useState([]);
  const showToast = useShowToast();

  const getSearchedQuery = async (searchText) => {
    if (!searchText) {
      showToast("Error", "Enter text to search", "error");
      return;
    }
    setIsLoading(true);
    setQueries([]);

    try {
      const q = query(collection(firestore, "query/"));

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        showToast("Error", "Query not found", "error");
        return queries;
      }

      const tempQueries = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (
          data.queryTitle.toLowerCase().includes(searchText.toLowerCase()) ||
          data.queryKeywords.toLowerCase().includes(searchText.toLowerCase())
        ) {
          tempQueries.push({ ...data, id: doc.id });
        }
      });

      setQueries(tempQueries);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getSearchedQuery, queries, setQueries };
};

export default useSearchQuery;
