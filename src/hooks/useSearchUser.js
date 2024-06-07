import { useState } from "react";
import useShowToast from "./useShowToast";
import { collection, getDocs, query } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useAuthStore from "../store/authStore";

const useSearchUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const authUser = useAuthStore((state) => state.user);

  const getUserProfile = async (username) => {
    setIsLoading(true);
    try {
      const q = query(collection(firestore, "users"));
      const querySnapshot = await getDocs(q);
      const membersArray = [];

      querySnapshot.forEach((doc) => {
        const userInfo = doc.data();
        const lowercaseFullName = userInfo.fullName.toLowerCase();
        const lowercaseUsername = userInfo.username.toLowerCase();
        if (lowercaseUsername.startsWith(username.toLowerCase()) || lowercaseFullName.includes(username.toLowerCase())) {
          membersArray.push(userInfo);
        }
      });

      membersArray.sort((a, b) => {
        const calculateSimilarity = (user) => {
          const { collegeName, department, city } = user;
          const { collegeName: authCollege, department: authDepartment, city: authCity } = authUser;

          if (collegeName === authCollege && department === authDepartment) {
            return 3;
          } else if (collegeName === authCollege && department !== authDepartment) {
            return 2;
          } else if (city === authCity) {
            return 1;
          }
          return 0;
        };

        const similarityA = calculateSimilarity(a);
        const similarityB = calculateSimilarity(b);

        if (similarityA !== similarityB) {
          return similarityB - similarityA;
        } else {
          return a.fullName.localeCompare(b.fullName);
        }
      });
      setUser(membersArray);
    } catch (err) {
      showToast("Error", err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getUserProfile, user, setUser };
};

export default useSearchUser;
