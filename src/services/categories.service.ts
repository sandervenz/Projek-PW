import CategoriesModel, { Category } from "../models/categories.model";

export const create = async (payload: Category): Promise<Category> => {
  const result = await CategoriesModel.create(payload);
  return result;
};
export const findAll = async (): Promise<Category[]> => {
  const result = await CategoriesModel.find();
  return result;
};
export const findOne = async (id: string): Promise<Category | null> => {
  const result = await CategoriesModel.findById(id);
  return result;
};
export const update = async (
  id: string,
  payload: Category
): Promise<Category | null> => {
  const result = await CategoriesModel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};
export const remove = async (id: string): Promise<Category | null> => {
  const result = await CategoriesModel.findOneAndDelete({
    _id: id,
  });
  return result;
};
