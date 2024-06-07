import React, { useEffect, useState } from 'react';
import { Select,VStack,FormLabel,FormControl,Text } from '@chakra-ui/react'; // Assuming you're using Chakra UI for styling

import useAuthStore from "../../store/authStore";
const config = {
  cUrl: 'https://api.countrystatecity.in/v1/countries',
  ckey: 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=='
};

const GetAddress = ({ handleAddressChange, userProfile  }) => {
 
	const authUser = useAuthStore((state) => state.user);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [citySelectDisabled, setCitySelectDisabled] = useState(true);

	const visitingOwnProfileAndAuth = authUser && authUser.username === userProfile.username; 
  useEffect(() => {
    loadCountries();

  }, []);

   const loadCountries = async() => {
    await fetch(config.cUrl, { headers: { "X-CSCAPI-KEY": config.ckey } })
      .then(response => response.json())
      .then(data => {
        setCountries(data); 
        if(userProfile?.country !=null){
          setSelectedCountry(userProfile?.country);
          const selectedCountryCode = userProfile?.country;
          setStates([]);
          setCities([]);
          setCitySelectDisabled(true);
          fetch(`${config.cUrl}/${selectedCountryCode}/states`, { headers: { "X-CSCAPI-KEY": config.ckey } })
            .then(response => response.json())
            .then(data => { 
              setStates(data);
            })
            .catch(error => console.error('Error loading states:', error));
        }
      })
      .catch(error => console.error('Error loading countries:', error));
      if(userProfile?.state !=null){
         
      fetch(`${config.cUrl}/${userProfile?.country}/states/${userProfile?.state}/cities`, { headers: { "X-CSCAPI-KEY": config.ckey } })
      .then(response => response.json())
      .then(data => { 
        setCities(data);
        setCitySelectDisabled(false);
         })
      .catch(error => console.error('Error loading cities:', error));
        }
  };

  const handleCountryChange = (event) => { 
    setSelectedCountry(event.target.value);
    const selectedCountryCode = event.target.value;
    setStates([]);
    setCities([]);
    setCitySelectDisabled(true);

    fetch(`${config.cUrl}/${selectedCountryCode}/states`, { headers: { "X-CSCAPI-KEY": config.ckey } })
      .then(response => response.json())
      .then(data => { 
        setStates(data);
      })
      .catch(error => console.error('Error loading states:', error));

    
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setCities([]);
    const selectedCountryCode = selectedCountry;
    const selectedStateCode = event.target.value;
    fetch(`${config.cUrl}/${selectedCountryCode}/states/${selectedStateCode}/cities`, { headers: { "X-CSCAPI-KEY": config.ckey } })
      .then(response => response.json())
      .then(data => { 
        setCities(data);
        setCitySelectDisabled(false);
        handleAddressChange(selectedCountryCode, selectedStateCode, data[0].iso2); // Passing selected country, state, and city to the parent component
      })
      .catch(error => console.error('Error loading cities:', error));
  };

  const handleCityChange = (event) => {
   handleAddressChange(selectedCountry, selectedState,event.target.value); // Passing selected country, state, and city to the parent component
  };

  return (
    <VStack spacing={4} width={"100%"} alignItems={"self-start"}>
      
			<FormControl id="Country">
      <FormLabel textColor={"#60AEFF"}>Country</FormLabel>
      <Select value={selectedCountry || userProfile?.country}
        onChange={handleCountryChange} 
			  disabled={!visitingOwnProfileAndAuth}
				required
        placeholder="Select country" >
        {countries.map(country => (
          <option key={country.iso2} value={country.iso2}>
            {country.name}
          </option>
        ))}
      </Select>
      </FormControl>

			<FormControl id="State">
      <FormLabel textColor={"#60AEFF"}>State</FormLabel> 
      <Select value={selectedState || userProfile?.state} onChange={handleStateChange} 
			  disabled={!visitingOwnProfileAndAuth || !states.length} 
				required
        placeholder="Select state"  >
        <option value="">Select State</option>
        {states && states.map(state => (
          <option key={state.iso2} value={state.iso2}>
            {state.name}
          </option>
        ))}
      </Select>
      </FormControl>

			<FormControl id="City">
      <FormLabel textColor={"#60AEFF"}>City</FormLabel>
      <Select value={userProfile?.city} disabled={!visitingOwnProfileAndAuth || citySelectDisabled } onChange={handleCityChange} 
              placeholder="Select city">
        <option value="">Select City</option>
        {cities && cities.map(city => (
          <option key={city.iso2} value={city.iso2}>
            {city.name}
          </option>
        ))}
      </Select>
      </FormControl>
    </VStack>
  );
};

export default GetAddress;
