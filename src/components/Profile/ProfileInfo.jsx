import {
	Avatar,
	Button,
	Divider,
	Flex,
	GridItem,
	Image,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Text,
	VStack,
	useDisclosure,
	FormControl,
	FormLabel,
	Input,
	Select,
  } from "@chakra-ui/react";
  import useAuthStore from "../../store/authStore";
  import useShowToast from "../../hooks/useShowToast";
  import { useState } from "react";
  import { firestore, storage } from "../../firebase/firebase";
  import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
  import GetAddress from "./GetAddress"

  import useEditInfo from "../../hooks/useEditInfo";
  import { Link,useParams } from "react-router-dom";
  import useGetUserProfileByUsername from "../../hooks/useGetUserProfileByUsername";

  const collegesInKolhapur = [
    "Abhinav Education Society’s College of Engineering & Technology, Vadwadi, Satara",
    "Adarsh Institute of Technology & Research Centre, Vita, Sangli",
    "Annasaheb Dange College of Engineering and Technology, Ashta",
    "Appasaheb Birnale College of Architecture, Sangli-Miraj Road, Sangli",
    "Arvind Gavli College of Engineering, Talmavle, Satara",
    "Balasaheb Mane Shikshan Prasarak Mandal’s Group of Institutions, Wathar Tarfe Vadgaon, Kolhapur",
    "Bharati Vidyapeeth's College of Engineering, Morewadi, Kolhapur",
    "College of Architecture, Shivaji Peth, Kolhapur",
    "College of Engineering & Technology, Sanjay Bhokare Group of Institute's, Miraj",
    "College of Engineering, Karad",
    "College of Engineering, Phaltan, Satara",
    "Department of Technology, Shivaji University, Kolhapur",
    "D. Y. Patil College of Engineering & Technology, Kasaba Bawada, Kolhapur",
    "Dhananjay Mahadik Group of Institutions, Vikaswadi, Kolhapur",
    "Dr. D. Y. Patil Engineering College, Talsande, Kolhapur",
    "Dr. Daultarao Aher Engineering Mayavidyalaya, Banavadi, Karad",
    "Dr. J. J. Magdum College of Engineering, Jaysingpur",
    "Jayawant College of Engineering & Management, Walawa, Sangli",
    "Karmaveer Bhaurao Patil College of Engineering and Polytechnic, Camp Satara",
    "Kolhapur Institute of Technology's College of Engineering, Gokul-Shirgaon",
    "Nanasaheb Mahadik College of Engineering, Peth, Sangli",
    "Padmabhooshan Vasantraodada Patil Institute of Technology, Budhgaon",
    "Rajarambapu Institute of Technology, Rajaramnagar, Sakharale",
    "Sanjeevan Engineering & Technology Institute, Panhala, Kolhapur",
    "Satara College of Engineering and Management, Limb, Satara",
    "Sau. Sushila Danchand Ghodawat Charitable Trust’s Group of Institutions, Atigre, Kolhapur",
    "Sharad Institute of Technology College of Engineering, Yadrav, Kolhapur",
    "Tatyasaheb Kore Institute of Engineering & Technology, Warananagar",
    "Textile & Engineering Institute, Rajwada Chowk, Ichalkarnji",
    "Textile & Engineering Institute, Rajwada Chowk, Ichalkarnji",
    "Vishwanathrao Patil Institute of Engineering and Technology, Kavalapur, Sangli",
    "Yashoda Technical Campus, College of Engineering, Vadhe, Satara"
    ];

const ProfileInfo = () => {
	const authUser = useAuthStore((state) => state.user);
	const { username } = useParams();
	const { userProfile } = useGetUserProfileByUsername(username);
	const visitingOwnProfileAndAuth = authUser && authUser.username === userProfile.username; 
	const showToast = useShowToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isUpdating, editInfo } = useEditInfo(); 
	const [formData, setFormData] = useState({
		name: userProfile?.fullName || "",
		gender: userProfile?.gender || "",
		country: userProfile?.country || "",
		state: userProfile?.state || "", 
		city: userProfile?.city || "",
		yearOfGraduation: userProfile?.yearOfGraduation || "",
		collegeName: userProfile?.collegeName || "",
		department: userProfile?.department || "",
		studyYear: userProfile?.studyYear || "",
	  });
 

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
		  await editInfo(formData);
		} catch (error) {
		  showToast("Error", error.message, "error");
		}
	  };


  const handleAddressChange = (country, state, city) => {
    setFormData({
      ...formData,
      country: country,
      state: state,
      city: city,
    });
  };

  const handleChange = (e) => {
	const { name, value } = e.target;
	setFormData({ ...formData, [name]: value }); 
  };

  return (
    <> 
        <VStack spacing={4}>
		<form onSubmit={handleSubmit}>
		  <VStack spacing={4}>
		  	<FormControl id="name">
			<FormLabel textColor={"#60AEFF"}>Name</FormLabel>
			<Input
				type="text"
				name="name"  
				value={formData.name } 
				onChange={handleChange}
				placeholder="Name"
                disabled={!visitingOwnProfileAndAuth}
				required
			/>
			</FormControl>

			<FormControl id="gender">
			<FormLabel textColor={"#60AEFF"}>Gender</FormLabel>
			<Select
				name="gender"
				value={formData.gender}
				onChange={handleChange}
                disabled={!visitingOwnProfileAndAuth}
				required
			>
				<option value="">Select gender</option>
				<option value="male">Male</option>
				<option value="female">Female</option>
				<option value="other">Other</option>
			</Select>
			</FormControl>

			<GetAddress handleAddressChange={handleAddressChange} userProfile={userProfile} data={"formData"} />
         
          <FormControl id="yearOfGraduation">
            <FormLabel textColor={"#60AEFF"}>Year of Graduation</FormLabel>
            <Select
              name="yearOfGraduation"
              value={formData.yearOfGraduation}
              onChange={handleChange}
              placeholder="Select year"
			        disabled={!visitingOwnProfileAndAuth}
              required
            >
              {/* Generate options from 1990 to current year */}
              {[...Array(new Date().getFullYear() - 1989)].map((_, index) => (
                <option key={index} value={new Date().getFullYear() - index}>
                  {new Date().getFullYear() - index}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl id="collegeName">
            <FormLabel textColor={"#60AEFF"}> College/School Name</FormLabel>
            <Select
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              placeholder="Select college/school"
			        disabled={!visitingOwnProfileAndAuth}
              required
            >
              {/* Render options for colleges in Kolhapur */}
              {collegesInKolhapur.map((college, index) => (
                <option key={index} value={college}>
                  {college}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl id="department">
            <FormLabel textColor={"#60AEFF"}>Department</FormLabel>
            <Select
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Select department"
			        disabled={!visitingOwnProfileAndAuth}
              required
            > 
              <option value="Computer Science and Engineering">Computer Science and Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Food Technology">Food Technology</option>
              <option value="Electronics Engineering">Electronics Engineering</option>
              <option value="Computer Science and Technology">Computer Science and Technology</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics and Telecommunication Technology">Electronics and Telecommunication Technology</option>
            </Select>
          </FormControl>
          <FormControl id="studyYear">
            <FormLabel textColor={"#60AEFF"}>Study Year</FormLabel>
            <Select
              name="studyYear"
              value={formData.studyYear}
              onChange={handleChange}
              placeholder="Select study year"
			        disabled={!visitingOwnProfileAndAuth}
              required
            >
              <option value="first">First Year</option>
              <option value="second">Second Year</option>
              <option value="third">Third Year</option>
              <option value="fourth">Fourth Year</option>
            </Select>
          </FormControl>
           {visitingOwnProfileAndAuth && <Button type="submit">Update</Button>}
        </VStack>
      </form>
        </VStack> 
    </>
  );
};

export default ProfileInfo;
