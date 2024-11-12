/**
 * src/services/product.service.ts
 */

import ProductsModel, { Product } from "../models/products.model";

export const create = async (payload: Product): Promise<Product> => {
  const result = await ProductsModel.create(payload);
  return result;
};
export const findAll = async (): Promise<Product[]> => {
  const result = await ProductsModel.find();
  return result;
};
export const findOne = async (id: string): Promise<Product | null> => {
  const result = await ProductsModel.findById(id);
  return result;
};
export const update = async (
  id: string,
  payload: Product
): Promise<Product | null> => {
  const result = await ProductsModel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};
export const remove = async (id: string): Promise<Product | null> => {
  const result = await ProductsModel.findOneAndDelete({
    _id: id,
  });
  return result;
};
