import Image from "next/image";
import { Inter } from "next/font/google";
import ChatPage from "@/components/ChatPage";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [currentUser, setCurrentUser] = useState<any>();
  useEffect(() => {
    const fetchCurrentUser = async (userId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ROUTE}/currentUser/${userId}`
      );
      const data = await res.json();

      setCurrentUser(data.user);

      const loggedUserSerialized = JSON.stringify(data.user);

      localStorage.setItem("user", loggedUserSerialized);
    };

    const user = localStorage.getItem("user");

    console.log("user", user);

    if (user !== null) {
      const testUser = JSON.parse(user);
      fetchCurrentUser(testUser._id);
    }
  }, []);
  return (
    <main>
      <ChatPage currentUser={currentUser} />
    </main>
  );
}
