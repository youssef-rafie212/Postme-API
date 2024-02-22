import nodemailer from "nodemailer";
import CustomTransportOptions from "./interfaces/transport-options.interface";

class Email {
  private from: string;
  private to: string;

  constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
  }

  private createTransport(): nodemailer.Transporter {
    const options: CustomTransportOptions = {
      host: process.env.EMAIL_HOST ?? "",
      port: process.env.EMAIL_PORT ?? "",
      auth: {
        user: process.env.EMAIL_USERNAME ?? "",
        pass: process.env.EMAIL_PASSWORD ?? "",
      },
    };

    const transport: nodemailer.Transporter =
      nodemailer.createTransport(options);

    return transport;
  }

  private async send(subject: string, text: string): Promise<void> {
    const transport = this.createTransport();
    try {
      await transport.sendMail({
        from: this.from,
        to: this.to,
        subject,
        text,
      });
    } catch (err: any) {
      throw new Error(
        "Something wrong happened while sending the email , please try again"
      );
    }
  }

  public async sendResetMessage(url: string): Promise<void> {
    await this.send(
      "Password Reset (valid for 10 mins)",
      `Send a PATCH request with the new password and password confirm to this URL : ${url}`
    );
  }
}

export default Email;
