import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  description: string;
  imageUrl?: string;
  status: 'brouillon' | 'planifié' | 'publié';
  publishDate?: Date;
  platforms: string[];
  postType?: string;
  authorId: mongoose.Types.ObjectId;
  visualResponsibleId?: mongoose.Types.ObjectId;
  reviewResponsibleId?: mongoose.Types.ObjectId;
  visualValidated: boolean;
  reviewValidated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
    },
    imageUrl: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['brouillon', 'planifié', 'publié'],
      default: 'brouillon'
    },
    publishDate: {
      type: Date,
      default: null
    },
    platforms: {
      type: [String],
      default: []
    },
    postType: {
      type: String,
      trim: true
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'L\'ID de l\'auteur est requis']
    },
    visualResponsibleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewResponsibleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    visualValidated: {
      type: Boolean,
      default: false
    },
    reviewValidated: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtuels pour les relations

// Auteur du post
PostSchema.virtual('author', {
  ref: 'User',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true
});

// Responsable visuel
PostSchema.virtual('visualResponsible', {
  ref: 'User',
  localField: 'visualResponsibleId',
  foreignField: '_id',
  justOne: true
});

// Responsable relecture
PostSchema.virtual('reviewResponsible', {
  ref: 'User',
  localField: 'reviewResponsibleId',
  foreignField: '_id',
  justOne: true
});

// Index pour faciliter les requêtes courantes
PostSchema.index({ status: 1 });
PostSchema.index({ authorId: 1 });
PostSchema.index({ visualResponsibleId: 1 });
PostSchema.index({ reviewResponsibleId: 1 });
PostSchema.index({ platforms: 1 });
PostSchema.index({ publishDate: 1 });

export default mongoose.model<IPost>('Post', PostSchema); 