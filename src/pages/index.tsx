import Image from "next/image";
import { Inter } from "next/font/google";
import ChatPage from "@/components/ChatPage";
import { useEffect, useState } from "react";
import { UserFlow } from "@/flows/users";
import { IUser, User } from "@/domain/user";
import { useDispatch } from "react-redux";
import { setAllUsers, setCurrentUser } from "@/state/appData/appDataSlice";
import { useSelector } from "react-redux";
import { getCurrentUser } from "@/state/appData/selectors";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/users");
        const data = await res.json();

        // console.log("users", data.users);
        const users: User[] = data.users;
        UserFlow.userList = Array.from(new Set([...users])).reduce(
          (acc, user) => {
            acc[user._id] = new User(user);
            return acc;
          },
          {} as Record<any, IUser>
        );

        dispatch(setAllUsers(data.users));

        const user = users[0];

        const test = UserFlow.userList[user._id];

        // console.log("test", test);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllUsers();
  }, []);
  // const [currentUser, setCurrentUser] = useState<any>();
  useEffect(() => {
    const fetchCurrentUser = async (userId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ROUTE}/currentUser/${userId}`
      );
      const data = await res.json();

      // console.log("data", data);

      dispatch(setCurrentUser(data.user._id));

      const userLoggedId = JSON.stringify(data.user._id);

      // console.log("loggedUserSerialized", userLoggedId);

      localStorage.setItem("user", userLoggedId);
    };

    const user = localStorage.getItem("user");

    // console.log("user", user);

    if (user !== null) {
      const userId = JSON.parse(user);
      fetchCurrentUser(userId);
    }
  }, []);

  const user = useSelector(getCurrentUser);
  return (
    <main>
      <ChatPage />
    </main>
  );
}
