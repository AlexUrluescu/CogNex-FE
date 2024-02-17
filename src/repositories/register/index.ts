import { IUser } from "@/domain/user";

export class RegisterRepository {
  async registerNewUser(user: IUser) {
    console.log("repo", user);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      });

      const data = await res.json();

      return data;
    } catch (error) {
      return error;
    }
  }
}
