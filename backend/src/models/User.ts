import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'user';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
  generateAuthToken: () => string;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Le nom d\'utilisateur est requis'],
      unique: true,
      trim: true,
      minlength: [3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères']
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir un email valide']
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
      select: false // Ne pas inclure par défaut dans les requêtes
    },
    role: {
      type: String,
      enum: ['admin', 'editor', 'user'],
      default: 'user'
    },
    avatar: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Middleware: Hashage du mot de passe avant l'enregistrement
UserSchema.pre<IUser>('save', async function(next) {
  // Seulement hasher le mot de passe s'il a été modifié ou est nouveau
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Méthode: Comparer le mot de passe fourni avec le mot de passe hashé
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Méthode: Générer un token JWT
UserSchema.methods.generateAuthToken = function(): string {
  const token = jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'jwt-secret-key',
    { expiresIn: '30d' }
  );
  return token;
};

export default mongoose.model<IUser>('User', UserSchema); 