import { Router, Request, Response } from 'express';
import { genSalt, hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/user.model';
require('dotenv').config();


const secretKey: string | undefined = process.env.SECRET_KEY || undefined;


const authRouter = Router();


authRouter.post('/register', [
  // Input validation
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 8, max: 32 }),
  //body('phone').isMobilePhone({}),
], async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = (email: string, phone: string) => {
      return User.findOne({
        $or: [
          { email: email },
          { phone: phone },
        ],
      });
    };

    let user = await existingUser(email, phone);

    
    if (user) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Create new user
    const newUser = new User({ name, email, password, phone });
    newUser.password = await hashPassword(newUser.password);
    // Save user to database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err: any) {
    res.status(500).json({ message: err.message});
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {

    // Use your JWT secret here (retrieve it from a safe place)

    if (!secretKey) {
      throw new Error('JWT secret is not defined');
    }
    
    const { emailOrPhone, password } = req.body;

    // Check if user exists
    // Check if user already exists
    const existingUser = (emailOrPhone: string) => {
      return User.findOne({
        $or: [
          { email: emailOrPhone },
          { phone: emailOrPhone },
        ],
      });
    };

    let user = await existingUser(emailOrPhone);
    if (!user) {
      return res.status(400).json({ message: 'Invalid Email or Phone! Please check your credentials and try again.' });
    }

    // Check password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Password! Please check your credentials and try again.' });
    }

    const token = sign({ name: user.name, sub: '/auth/login' + user._id }, secretKey, { expiresIn: '1d' });
    res.json({ user: { id: user._id, name: user.name }, token: `${token}` });
  }
  catch (err: any) {
    console.error('Error Started..\n' + err + '\nError Ended.');
    res.status(500).json({ message: err.message });
  }
});

// Logout route
authRouter.get('/logout', (req: Request, res: Response) => {
  // Clear the JWT token from client-side
  // res.clearCookie('jwtToken'); // For cookie-based tokens
  // OR
  // Delete token from local storage, if using browser's local storage
  res.status(200).json({ msg: 'Logged out successfully' });
});

const hashPassword = async function (password: string) {
  return await hash(password, await genSalt(10));
};

export default authRouter;
