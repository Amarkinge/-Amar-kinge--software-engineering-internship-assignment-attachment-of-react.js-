import { Router, Request, Response } from 'express';
import Bookmark from '../models/bookmark.model'
import mongoose from 'mongoose';
const bookmarkRouter = Router();



bookmarkRouter.get('/bookmarks', async (req: Request, res: Response) => {
    try {
        const bookmarks = await Bookmark.find()
        res.status(200).json(bookmarks);
    } catch (err: any) {
        res.status(500).json({ message: "Server error" + err })
    }

});

//GET /:id (using BsonObject)
bookmarkRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!isValid(id)) return res.status(400).send("Invalid Bookmark Id");
   try{
    const bookmark = await Bookmark.findById(id)
    if (!bookmark)
    {
        return res.status(404).json({ message: 'The bookmark with the given ID was not found.'})
    }
    return res.status(200).json(bookmark)
   }
   catch (error) {
    res.status(500).json({ message: 'Error deleting bookmark', error });
}
});

//DELETE /bookmarks/:id (using BsonObject)
bookmarkRouter.delete('/delete/:id', async (req: Request, res: Response) => {
    const bookmarkId = req.params.id;
    if (!isValid(bookmarkId)) return res.status(400).send("Invalid Bookmark Id");
    try {
        await Bookmark.findByIdAndDelete(bookmarkId);
        res.status(200).json({ message: 'Bookmark deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting bookmark', error });
    }

});

function isValid(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id)
}

bookmarkRouter.post('/add', async (req: Request, res: Response) => {
    try {
        const { userId, recipeId } = req.body;
        if (!isValid(userId) || !isValid(recipeId)) 
        {
            return res.status(400).json({ message: "Invalid userId or recipeId."});
        }
        // Create a new bookmark instance
        const bookmark = new Bookmark({ user: userId, recipe: recipeId });
        // Save the bookmark to the database
        await bookmark.save();
        res.status(201).json({ message: 'Bookmark saved successfully', bookmark });
    } catch (error: any) {
        res.status(500).json({ message: 'Error saving bookmark', error });
    }
});

bookmarkRouter.get('/user/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId;

    try {
        if(!isValid(userId)) 
        {
            return res.status(400).json({ message: "Invalid userId."});
        }
        const bookmarks = await Bookmark.find({ user: userId });
        res.status(200).json(bookmarks);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving bookmarks for user', error });
    }
});

bookmarkRouter.get('/recipe/:recipeId', async (req: Request, res: Response) => {
    const recipeId = req.params.recipeId;
    if(!isValid(recipeId)) 
    {
        return res.status(400).json({ message: "Invalid recipeId."});
    }
    try {
        const bookmarks = await Bookmark.find({ recipe: recipeId });
        res.status(200).json(bookmarks);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving bookmarks for recipe', error });
    }
});

export default bookmarkRouter;
