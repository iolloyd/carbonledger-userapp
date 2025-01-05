require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');

// Create client for ID token verification only
const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

const app = express();
const port = 8787;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Simplified Google auth endpoint - only verifies the token
app.post('/auth/google/callback', async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'No credential provided'
      });
    }

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.VITE_GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    
    // Verify email domain
    if (!email.endsWith('@carbonledger.tech')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email domain'
      });
    }
    
    res.json({
      success: true,
      user: { email, name, picture }
    });
  } catch (error) {
    console.error('Auth error details:', error.message);
    res.status(401).json({
      success: false,
      message: 'Authentication failed: ' + error.message
    });
  }
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
}); 
