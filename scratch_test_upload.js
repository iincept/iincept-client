const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
  try {
    const formData = new FormData();
    // Create a simple dummy buffer as a text file content and name it test.png
    const dummyBuffer = Buffer.from('dummy image content');
    formData.append('images', dummyBuffer, { filename: 'test.png', contentType: 'image/png' });

    // First login to get token
    const loginRes = await axios.post('http://localhost:5088/api/auth/login', {
      email: 'admin@iincept.com',
      password: 'password123'
    });
    const token = loginRes.data.token;

    console.log("Logged in successfully, token retrieved.");

    const res = await axios.post('http://localhost:5088/api/upload/multiple', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });

    console.log("Upload response:", res.data);
  } catch (err) {
    console.error("Upload failed:", err.response ? err.response.data : err.message);
  }
}

testUpload();
