import { Schema, model, Document } from 'mongoose';


interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  hashPassword(password: string): string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (value: string) => {
        // validate email format
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(value).toLowerCase());
      },
      message: 'Invalid email format',
    },
  },
  password: {
    type: String,
    required: true,
    unique: true,
    // validate: {
    //   validator: (value: string) => {
    //     // validate password strength
    //     const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,32}$/;
    //     return re.test(value);
    //   },
    //   message: 'Password must be at least 8 characters long and at most 32 characters long, and contain at least one lowercase letter, one uppercase letter, and one number',
    // },
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 15,
    validate: {
      validator: (value: string) => {
        // validate phone number format
        const re = /^(\+\d{1,3})? ?(\d{1,4})?[-. (]*(\d{1,3})[-. )]*(\d{1,4})[-. ]*(\d{1,9})*$/;
        return re.test(String(value).trim());
      },
      message: 'Invalid phone number format',
    },
  },
}, { versionKey: false });

export default model<IUser>('User', userSchema);