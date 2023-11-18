import mongoose, { Document, Schema } from 'mongoose';

export interface CommentDocument extends Document {
  text: string;
  userId: Document['_id'];
  carId: Document['_id'];
  children: Document['_id'][];
  likes: number;
  dislikes: number;
  visibility: {
    isApproved: boolean;
    isFlagged: boolean;
  };
  depth: number;
  reports: number;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    children: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    visibility: {
      isApproved: { type: Boolean, default: true },
      isFlagged: { type: Boolean, default: false },
    },
    depth: { type: Number, default: 0 },
    reports: { type: Number, default: 0 },
    parentId: {
      type: Schema.ObjectId,
      default: undefined,
    },
  },
  {
    timestamps: true,
  },
);

const CommentModel = mongoose.model<CommentDocument>('comment', commentSchema);

export default CommentModel;
