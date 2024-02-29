import { IUser } from "@/domain/user";
import { RegisterRepository } from "@/repositories/register";
import { UserLogin } from "@/types";

class UserFlow {
  registerRepository = new RegisterRepository();
  userList: Record<string, IUser> = {};
  async registerNewUser(user: IUser) {
    const newUser = await this.registerRepository.registerNewUser(user);

    return newUser;
  }

  async loginUser(user: UserLogin) {
    const loggedUser = await this.registerRepository.loginUser(user);
    return loggedUser;
  }
}

const userFlow = new UserFlow();

export { userFlow as UserFlow };
