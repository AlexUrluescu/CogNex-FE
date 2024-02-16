import Image from "next/image";
import { Inter } from "next/font/google";
import ChatPage from "@/components/ChatPage";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <ChatPage />
    </main>
  );
}
