import './App.css';
import axios from "axios";
import Words from "./components/words.tsx";
import { useEffect, useState } from 'react';

const API_URL = "http://localhost:3000/api/v1/words";

function getAPIData() {
  return axios.get(API_URL).then(response => response.data);
}

function App() {
  const [words, setWords] = useState([]);
  useEffect(() => {
    let mounted = true;
    getAPIData().then(items => {
      if (mounted) {
        setWords(items);
      }
    });
    return () => {mounted = false};
  }, []);
  return (
    <Words words={words} />
  )
}

export default App
