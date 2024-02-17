import { IUser } from "@/domain/user";
import { RegisterRepository } from "@/repositories/register";

class RegisterFlow {
  registerRepository = new RegisterRepository();
  async registerNewUser(user: IUser) {
    console.log("user", user);

    const newUser = await this.registerRepository.registerNewUser(user);

    console.log("newUser", newUser);
  }
}

const registerFlow = new RegisterFlow();

export { registerFlow as RegisterFlow };
