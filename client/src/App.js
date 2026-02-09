import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from './config';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/test`)
      .then(res => setMessage(res.data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="App">
      <h1>MongoDB Atlas Test</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
