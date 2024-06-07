import { useEffect, useState } from 'react';
import useGetUserProfileById from './useGetUserProfileById';

const useFetchMemberProfiles = (memberIds) => {
  const [memberProfiles, setMemberProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profiles = await Promise.all(memberIds.map(async (memberId) => {
          const profile = await useGetUserProfileById(memberId);
          return profile;
        }));
        setMemberProfiles(profiles);
      } catch (error) {
        console.error("Error fetching member profiles:", error);
      }
    };

    fetchProfiles();
  }, [memberIds]);

  return memberProfiles;
};

export default useFetchMemberProfiles;
