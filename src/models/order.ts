import mongoose, { Document } from 'mongoose'
import { IProduct } from './product'

export interface IOrderProduct {
  product: IProduct['_id']
  quantity: number
}

export interface IOrderPayment {}

export interface IOrder extends Document {
  products: IOrderProduct[]
  payment: IOrderPayment
  user: mongoose.Schema.Types.ObjectId
  status: 'pending' | 'shipping' | 'shipped' | 'delivered' | 'canceled'
  createdAt: Date
  updatedAt: Date
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Products',
          required: [true, 'One product at least is required'],
        },
        quantity: {
          type: Number,
          required: [true, 'Product quantity is required'],
          trim: true,
        },
      },
    ],
    payment: {
      type: Object,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: [true, 'User is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'shipping', 'shipped', 'delivered', 'canceled'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

export const Order = mongoose.model<IOrder>('Orders', orderSchema)
