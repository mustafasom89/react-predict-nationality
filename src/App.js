import './App.css';
import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [userName, setuserName] = useState('');
  const [CountryName, setCountryName] = useState('');
  const [nationality, setNationality] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    }, [])

    const fetchCountryName = async (CountryID) => {
      try {

        console.log("CountryName:", CountryID);
        const res = await fetch(`https://restcountries.com/v3/alpha/${CountryID}`);
        const data = await res.json();
        console.log(res.status);
        const commonName = data[0].name.common;
        setCountryName(commonName);
        console.log("commonName", commonName);
        //setCountryName(data[0].name);        
      } catch (error) {
        console.error('Error:', error);
        setCountryName('An error occurred');
      }
    };

  const predictNationality = async () => {
    if (userName.trim() === '') {
      return;
    }

    try {
      const res = await fetch(`https://api.nationalize.io?name=${userName}`);
      const data = await res.json();

      if (data.country && data.country.length > 0) {
        setNationality(data.country[0]);
        const country_id= data.country[0].country_id;
        fetchCountryName(country_id);
      } else {
        await setNationality(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={userName}
        onChange={(e)=>setuserName(e.target.value)}
        ref={inputRef}
      />
      <button onClick={predictNationality}>Send Request</button>
      
      {nationality && (
        <div>
          <h1>Nationality Prediction:</h1>
          <p>Country id: {nationality.country_id}</p>
          <p>Country Name: {CountryName}</p>
          <p>Probability: {nationality.probability}</p>
        </div>
      )}
    </div>
  );
}

export default App;
