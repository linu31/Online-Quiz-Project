// // Install required packages first:
// // npm install express mongoose body-parser dotenv twilio

// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const twilio = require('twilio');
// const path = require('path');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Twilio Client
// const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => {
//     console.log('MongoDB Connected');
//     insertSampleUsers(); // Insert sample users after connecting to MongoDB
//   })
//   .catch(err => console.error('MongoDB connection error:', err));

// // User Schema
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   otp: String,
//   otpExpires: Date, // OTP expiration time
// });

// const User = mongoose.model('User', userSchema);

// // Sample Users
// const sampleUsers = [
//   { name: 'Alice', email: 'alice1@gmail.com' },
//   { name: 'Bob', email: 'bob2@gmail.com' },
//   { name: 'Charlie', email: 'charlie3@gmail.com' },
//   { name: 'David', email: 'david4@gmail.com' },
//   { name: 'Eva', email: 'eva5@gmail.com' }
// ];

// // Function to insert sample users
// const insertSampleUsers = async () => {
//   try {
//     await User.insertMany(sampleUsers, { ordered: false });
//     console.log('Sample users inserted successfully.');
//   } catch (error) {
//     if (error.code === 11000) {
//       console.log('Sample users already exist in the database.');
//     } else {
//       console.error('Error inserting sample users:', error);
//     }
//   }
// };

// // Middleware
// app.use(bodyParser.json());

// // Serve the login page from the root directory
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'login.html'));
// });

// // Generate OTP and save it to MongoDB
// app.post('/api/auth/send-otp', async (req, res) => {
//   const { name, email } = req.body;

//   if (!name || !email) {
//     return res.status(400).json({ success: false, message: 'Name and email are required.' });
//   }

//   try {
//     // Generate a random 4-digit OTP
//     const otp = Math.floor(1000 + Math.random() * 9000).toString();
//     const otpExpires = new Date(Date.now() + 5 * 60000); // OTP expires in 5 minutes

//     // Save or update the user with the new OTP and expiration time
//     await User.findOneAndUpdate(
//       { email },
//       { name, otp, otpExpires },
//       { upsert: true, new: true }
//     );

//     // Send OTP via Twilio SMS
//     await client.messages.create({
//       body: `Your OTP is: ${otp}`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: process.env.ADMIN_PHONE_NUMBER, // Replace with user's phone number if available
//     });

//     // console.log('OTP sent successfully:', otp);
//     res.json({ success: true, message: 'OTP sent successfully.' });
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     res.status(500).json({ success: false, message: 'Failed to send OTP.' });
//   }
// });

// // Verify OTP
// app.post('/api/auth/verify-otp', async (req, res) => {
//   const { email, otp } = req.body;

//   if (!email || !otp) {
//     return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
//   }

//   try {
//     // Find the user by email and OTP
//     const user = await User.findOne({ email, otp });

//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found or invalid OTP.' });
//     }

//     // Check if the OTP has expired
//     if (user.otpExpires < new Date()) {
//       return res.status(400).json({ success: false, message: 'OTP has expired.' });
//     }

//     // OTP is valid
//     res.json({ success: true, message: 'OTP verified successfully.' });
//   } catch (error) {
//     console.error('Error verifying OTP:', error);
//     res.status(500).json({ success: false, message: 'Internal server error.' });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Twilio Client
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB Connected');
    insertSampleUsers(); // Insert sample users after connecting to MongoDB
  })
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  otp: String,
  otpExpires: Date, // OTP expiration time
});

const User = mongoose.model('User', userSchema);

// Sample Users
const sampleUsers = [
  { name: 'Alice', email: 'alice1@gmail.com' },
  { name: 'Bob', email: 'bob2@gmail.com' },
  { name: 'Charlie', email: 'charlie3@gmail.com' },
  { name: 'David', email: 'david4@gmail.com' },
  { name: 'Eva', email: 'eva5@gmail.com' }
];

// Function to insert sample users
const insertSampleUsers = async () => {
  try {
    await User.insertMany(sampleUsers, { ordered: false });
    console.log('Sample users inserted successfully.');
  } catch (error) {
    if (error.code === 11000) {
      console.log('Sample users already exist in the database.');
    } else {
      console.error('Error inserting sample users:', error);
    }
  }
};

// Middleware
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Serve the login page from the root directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve the OTP page
app.get('/otp', (req, res) => {
  res.sendFile(path.join(__dirname, 'otp.html'));
});

// Serve the OTP page
app.get('/instruction', (req, res) => {
  res.sendFile(path.join(__dirname,  'instruction.html'));
});

app.get('/quiz1', (req, res) => {
  res.sendFile(path.join(__dirname,  'quiz1.html'));
});

// Generate OTP and save it to MongoDB
app.post('/api/auth/send-otp', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required.' });
  }

  try {
    // Generate a random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60000); // OTP expires in 5 minutes

    // Save or update the user with the new OTP and expiration time
    await User.findOneAndUpdate(
      { email },
      { name, otp, otpExpires },
      { upsert: true, new: true }
    );

    // Send OTP via Twilio SMS
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.ADMIN_PHONE_NUMBER, // Replace with user's phone number if available
    });

    res.json({ success: true, message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP.' });
  }
});

// Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
  }

  try {
    // Find the user by email and OTP
    const user = await User.findOne({ email, otp });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found or invalid OTP.' });
    }

    // Check if the OTP has expired
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired.' });
    }

    // OTP is valid
    res.json({ success: true, message: 'OTP verified successfully.' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});