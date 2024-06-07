import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,

} from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { useParams } from "react-router-dom";
import useGetUserProfileByUsername from "./useGetUserProfileByUsername";


const useGetFollowers = () => {
  const { username } = useParams();
  const { userProfile } = useGetUserProfileByUsername(username);
  const [isLoading, setIsLoading] = useState(true);
  const [followersUsers, setFollowersUsers] = useState([]);
  const showToast = useShowToast();

  useEffect(() => {
    const getFollowersUsers = async () => {
      setIsLoading(true);
      try {
        const usersRef = collection(firestore, "users");
        let q = query(
            usersRef,
            where("uid", "in", [userProfile?.uid, ...userProfile.following]),
            orderBy("uid")
          );

          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
              if (doc.id !== userProfile?.uid) {
                users.push({ ...doc.data(), id: doc.id });
              }
            });
            setFollowersUsers(users);
          });

          return () => {
            unsubscribe();
          };
        
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    getFollowersUsers();
  }, [showToast,  userProfile]);

  return { isLoading, followersUsers,userProfile };
};

export default useGetFollowers;
