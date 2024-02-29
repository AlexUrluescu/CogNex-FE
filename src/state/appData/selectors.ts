import { UserFlow } from "@/flows/users";
import { RootState } from "../store";

export const getCurrentUser = (state: RootState) => {
  return state.appData.currentUser;
};

export const getAllUsers = (state: RootState) => {
  return state.appData.users;
};
