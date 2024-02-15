import express, {Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import cors from "cors";
require('dotenv').config();
import  Jwt  from 'jsonwebtoken';
import authRouter from './routes/auth.route';
import recipeRouter from './routes/recipe.route';
import bookmarkRouter from './routes/bookmark.route';
import recipeApiRouter from './routes/recipe-api.route';

const PORT = process.env.PORT || 5000;
const basePath = process.env.BASE_PATH;
const dbUrl = process.env.DATABASE_URL;
const secretKey: string = process.env.SECRET_KEY || '';
const app = express();

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(dbUrl, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

if (!dbUrl) throw new Error("Database connection string is not defined.");
// MongoDB connection
mongoose.connect(dbUrl, {
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const authorize = (req:Request, res:Response, next:NextFunction) => {
  // Get the token from the request headers
  const token = req.headers.authorization;

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }


  try {
    // Verify the token
    const tokenWithoutBearer = token.slice(token.indexOf(' ') + 1);
    const decoded = Jwt.verify(tokenWithoutBearer, secretKey, {complete:true}) as any;
    // Attach the decoded payload to the request object
    
    req.headers['set-cookie']=decoded.payload.name;
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authorization token' });
  }
};
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Routes
app.use(basePath+'auth/', authRouter);
app.use(basePath+'recipeapi/',recipeApiRouter);
app.use(authorize);
app.use(basePath+'recipe/', recipeRouter);
app.use(basePath+'bookmark/', bookmarkRouter);


// Start server on the specified port and binding host address.
app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});