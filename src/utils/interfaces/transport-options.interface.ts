import { TransportOptions } from "nodemailer";

interface CustomTransportOptions extends TransportOptions {
  host: string;
  port: string;
  auth: {
    user: string;
    pass: string;
  };
}

export default CustomTransportOptions;
