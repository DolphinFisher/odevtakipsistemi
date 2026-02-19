import axios from 'axios';

async function checkBackend() {
  try {
    console.log('Checking GET http://localhost:3001/api/homeworks');
    const res = await axios.get('http://localhost:3001/api/homeworks');
    console.log('Status:', res.status);
    console.log('Headers:', res.headers);
    console.log('Data:', res.data);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
        console.log('Response data:', error.response.data);
    }
  }
}

checkBackend();
