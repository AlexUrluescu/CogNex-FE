import { IUser } from "@/domain/user";
import { RegisterRepository } from "@/repositories/register";
import { UserLogin } from "@/types";

class RegisterFlow {
  registerRepository = new RegisterRepository();
  async registerNewUser(user: IUser) {
    const newUser = await this.registerRepository.registerNewUser(user);
  }

  async loginUser(user: UserLogin) {
    const loggedUser = await this.registerRepository.loginUser(user);
  }
}

const registerFlow = new RegisterFlow();

export { registerFlow as RegisterFlow };
