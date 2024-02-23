import { IUser } from "@/domain/user";
import { UserLogin } from "@/types";

export class RegisterRepository {
  async registerNewUser(user: IUser) {
    console.log("intra");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      });

      const data = await res.json();

      if (data.user === undefined || data.sucess === false) {
        return;
      }

      return data;
    } catch (error) {
      return error;
    }
  }

  async loginUser(user: UserLogin) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      });

      const data = await res.json();

      if (data.user === undefined || data.ok === false) {
        return;
      }

      return data.user;
    } catch (error) {
      return error;
    }
  }
}
