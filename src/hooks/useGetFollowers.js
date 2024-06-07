import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
 
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

        const answerDocRef = doc(usersRef, userProfile.uid);
          const unsubscribeUser = onSnapshot(answerDocRef, (userSnapshot) => {
          const existingFollowers = userSnapshot.data()?.followers || [];

          const unsubscribeFollowers = onSnapshot(query(
            usersRef,
            where("uid", "in", existingFollowers),
            orderBy("uid")
          ), (followerSnapshot) => {
            const users = followerSnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            setFollowersUsers(users);
          });

          return () => unsubscribeFollowers(); 
        });

        return () => unsubscribeUser(); 
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    getFollowersUsers();
  }, [showToast, userProfile]);

  return { isLoading, followersUsers };
};

export default useGetFollowers;
