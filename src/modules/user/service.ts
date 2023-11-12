import { FilterQuery, QueryOptions } from 'mongoose';
import User, { UserDocument } from './model';
import { CreateUserInputs } from './schema';

export async function createNewUser(input: CreateUserInputs) {
  return User.create(input);
}

export async function findUser(query: FilterQuery<UserDocument>, options: QueryOptions = { lean: true }) {
  return User.findOne(query, {}, options);
}

export async function removeUser(query: FilterQuery<UserDocument>) {
  return User.deleteOne(query);
}
