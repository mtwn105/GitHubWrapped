import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISupporter extends Document {
  paymentId: string;
  name: string;
  email: string;
  amount: number;
  currency: string;
  createdAt: Date;
  displayOnWall: boolean;
}

const SupporterSchema = new Schema<ISupporter>(
  {
    paymentId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    createdAt: { type: Date, default: Date.now },
    displayOnWall: { type: Boolean, default: true },
  },
  {
    collection: "supporters",
  }
);

const Supporter: Model<ISupporter> =
  mongoose.models.Supporter ||
  mongoose.model<ISupporter>("Supporter", SupporterSchema);

export default Supporter;

