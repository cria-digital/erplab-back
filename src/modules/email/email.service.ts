import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendPasswordResetEmail(
    email: string,
    nome: string,
    resetToken: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Recuperação de Senha - ERP Lab',
      template: './reset-password',
      context: {
        nome,
        resetToken,
        validadeMinutos: 30,
        supportEmail: this.configService.get(
          'SUPPORT_EMAIL',
          'suporte@erplab.com',
        ),
      },
    });
  }

  async sendPasswordChangedNotification(
    email: string,
    nome: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Senha Alterada - ERP Lab',
      template: './password-changed',
      context: {
        nome,
        supportEmail: this.configService.get(
          'SUPPORT_EMAIL',
          'suporte@erplab.com',
        ),
      },
    });
  }

  async sendWelcomeEmail(
    email: string,
    nome: string,
    temporaryPassword?: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Bem-vindo ao ERP Lab',
      template: './welcome',
      context: {
        nome,
        temporaryPassword,
        loginUrl: `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/login`,
        supportEmail: this.configService.get(
          'SUPPORT_EMAIL',
          'suporte@erplab.com',
        ),
      },
    });
  }
}
