import UserModel from "./user.model";
import token from "../../utils/token";

class UserService {
  private user = UserModel;

  async signup(
    username: string,
    email: string,
    password: string,
    passwordConfirm: string
  ): Promise<string | Error> {
    try {
      const user = await this.user.create({
        username,
        email,
        password,
        passwordConfirm,
      });

      const accessToken = token.createToken(user);

      return accessToken;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async login(email: string, password: string): Promise<string | Error> {
    try {
      const user = await this.user.findOne({ email }).select("+password");

      if (!user) throw new Error("Wrong credentials");

      if (!(await user.isCorrectPassword(password, user.password)))
        throw new Error("Wrong credentials");

      const accessToken = token.createToken(user);

      return accessToken;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}

export default UserService;
