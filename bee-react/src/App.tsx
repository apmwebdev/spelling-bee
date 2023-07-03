import './App.css';
// import axios from "axios";
// import { useEffect, useState } from 'react';
import Puzzle from './components/puzzle.tsx';

// const API_URL = "http://localhost:3000/api/v1/words";
//
// function getAPIData() {
//   return axios.get(API_URL).then(response => response.data);
// }

function App() {
  // const [words, setWords] = useState([]);
  // useEffect(() => {
  //   let mounted = true;
  //   getAPIData().then(items => {
  //     if (mounted) {
  //       setWords(items);
  //     }
  //   });
  //   return () => {mounted = false};
  // }, []);
  return (
    <div className="sb-top-container">
      <header className="sb-header"></header>
      <div className="sb-main-container">
        <div className="sb-main">
          <div className="sb-controls">
            <Puzzle centerLetter='M' otherLetters={['D', 'E', 'H', 'O', 'T', 'U']} />
          </div>
          <div className="sb-status">status</div>
        </div>
      </div>
    </div>
  )
}

export default App
