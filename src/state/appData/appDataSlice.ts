import { IUser } from "@/domain/user";
import { UserFlow } from "@/flows/users";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IAppDataState {
  currentUser: IUser;
  users: IUser[];
}

const initialState: IAppDataState = {
  currentUser: {
    _id: undefined,
    email: "",
    files: [],
    firstName: "",
    lastName: "",
    age: "",
    password: "",
  },
  users: [],
};

const appDataSlice = createSlice({
  name: "appData",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.currentUser = UserFlow.userList[action.payload];
    },
    setAllUsers: (state, action: PayloadAction<IUser[]>) => {
      state.users = action.payload;
    },
  },
});

export const { setCurrentUser, setAllUsers } = appDataSlice.actions;
export default appDataSlice.reducer;
