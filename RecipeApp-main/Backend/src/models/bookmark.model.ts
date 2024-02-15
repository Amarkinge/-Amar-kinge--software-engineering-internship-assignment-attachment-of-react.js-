import { Schema, model, Types, Document } from 'mongoose';
import Recipe from './recipe.model';
import  User from './user.model';

interface IBookmark extends Document {
  user: Types.ObjectId;
  recipe: Types.ObjectId;
}

const bookmarkSchema = new Schema<IBookmark>({
  user: {
    type: Schema.Types.ObjectId,
    ref:User,
    required: true,
  },
  recipe: {
    type: Schema.Types.ObjectId,
    ref: Recipe,
    required: true,
  },
  // Add more fields as needed
}, { versionKey: false });

const Bookmark = model<IBookmark>('Bookmark', bookmarkSchema);

export default Bookmark;