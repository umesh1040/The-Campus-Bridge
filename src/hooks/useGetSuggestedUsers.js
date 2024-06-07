import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetSuggestedUsers = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const authUser = useAuthStore((state) => state.user);
    const showToast = useShowToast();

    useEffect(() => {
        const getSuggestedUsers = async () => {
            setIsLoading(true);
            try {
                if (!authUser) return;

                const usersRef = collection(firestore, "users");
                const q = query(
                    usersRef,
                    where("uid", "not-in", [authUser.uid, ...authUser.following]),
                    orderBy("uid")
                );

                const querySnapshot = await getDocs(q);
                const users = [];

                querySnapshot.forEach((doc) => {
                    users.push({ ...doc.data(), id: doc.id });
                });

                const sortedUsers = users.sort((a, b) => {
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

                setSuggestedUsers(sortedUsers);
            } catch (error) { 
            } finally {
                setIsLoading(false);
            }
        };

        getSuggestedUsers();
    }, [authUser, showToast]);

    return { isLoading, suggestedUsers };
};

export default useGetSuggestedUsers;
