import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import User, { UserDocument } from './model';
// import { CreateUserInputs } from './schema';

// export async function createNewUser(input: CreateUserInputs) {
//   return User.create(input);
// }

export async function findUser(query: FilterQuery<UserDocument>, options: QueryOptions = { lean: true }) {
  return User.findOne(query, {}, options);
}

export async function findAndUpdateUser(
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions = {},
) {
  return User.findOneAndUpdate(query, update, options);
}

export async function deleteUser(query: FilterQuery<UserDocument>) {
  return User.deleteOne(query);
}
