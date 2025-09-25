import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

describe('EmailService', () => {
  let service: EmailService;

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email successfully', async () => {
      const email = 'user@example.com';
      const nome = 'João Silva';
      const resetToken = 'token123';
      const frontendUrl = 'http://localhost:3000';
      const supportEmail = 'suporte@erplab.com';

      mockConfigService.get
        .mockReturnValueOnce(frontendUrl)
        .mockReturnValueOnce(supportEmail);
      mockMailerService.sendMail.mockResolvedValue(undefined);

      await service.sendPasswordResetEmail(email, nome, resetToken);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: 'Recuperação de Senha - ERP Lab',
        template: './reset-password',
        context: {
          nome,
          resetUrl: `${frontendUrl}/reset-password?token=${resetToken}`,
          validadeHoras: 2,
          supportEmail,
        },
      });
    });

    it('should use default values when config values are not set', async () => {
      const email = 'user@example.com';
      const nome = 'João Silva';
      const resetToken = 'token123';

      mockConfigService.get.mockImplementation(
        (key, defaultValue) => defaultValue,
      );
      mockMailerService.sendMail.mockResolvedValue(undefined);

      await service.sendPasswordResetEmail(email, nome, resetToken);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: 'Recuperação de Senha - ERP Lab',
        template: './reset-password',
        context: {
          nome,
          resetUrl: `http://localhost:3000/reset-password?token=${resetToken}`,
          validadeHoras: 2,
          supportEmail: 'suporte@erplab.com',
        },
      });
    });

    it('should handle mailer service errors', async () => {
      const email = 'user@example.com';
      const nome = 'João Silva';
      const resetToken = 'token123';

      mockConfigService.get.mockImplementation(
        (key, defaultValue) => defaultValue,
      );
      mockMailerService.sendMail.mockRejectedValue(new Error('SMTP Error'));

      await expect(
        service.sendPasswordResetEmail(email, nome, resetToken),
      ).rejects.toThrow('SMTP Error');
    });
  });

  describe('sendPasswordChangedNotification', () => {
    it('should send password changed notification successfully', async () => {
      const email = 'user@example.com';
      const nome = 'João Silva';
      const supportEmail = 'suporte@erplab.com';

      mockConfigService.get.mockReturnValue(supportEmail);
      mockMailerService.sendMail.mockResolvedValue(undefined);

      await service.sendPasswordChangedNotification(email, nome);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: 'Senha Alterada - ERP Lab',
        template: './password-changed',
        context: {
          nome,
          supportEmail,
        },
      });
    });

    it('should use default support email when not configured', async () => {
      const email = 'user@example.com';
      const nome = 'João Silva';

      mockConfigService.get.mockImplementation(
        (key, defaultValue) => defaultValue,
      );
      mockMailerService.sendMail.mockResolvedValue(undefined);

      await service.sendPasswordChangedNotification(email, nome);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: 'Senha Alterada - ERP Lab',
        template: './password-changed',
        context: {
          nome,
          supportEmail: 'suporte@erplab.com',
        },
      });
    });

    it('should handle mailer service errors', async () => {
      const email = 'user@example.com';
      const nome = 'João Silva';

      mockConfigService.get.mockImplementation(
        (key, defaultValue) => defaultValue,
      );
      mockMailerService.sendMail.mockRejectedValue(new Error('SMTP Error'));

      await expect(
        service.sendPasswordChangedNotification(email, nome),
      ).rejects.toThrow('SMTP Error');
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email with temporary password', async () => {
      const email = 'user@example.com';
      const nome = 'João Silva';
      const temporaryPassword = 'TempPass123';
      const frontendUrl = 'http://localhost:3000';
      const supportEmail = 'suporte@erplab.com';

      mockConfigService.get
        .mockReturnValueOnce(frontendUrl)
        .mockReturnValueOnce(supportEmail);
      mockMailerService.sendMail.mockResolvedValue(undefined);

      await service.sendWelcomeEmail(email, nome, temporaryPassword);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: 'Bem-vindo ao ERP Lab',
        template: './welcome',
        context: {
          nome,
          temporaryPassword,
          loginUrl: `${frontendUrl}/login`,
          supportEmail,
        },
      });
    });

    it('should send welcome email without temporary password', async () => {
      const email = 'user@example.com';
      const nome = 'João Silva';
      const frontendUrl = 'http://localhost:3000';
      const supportEmail = 'suporte@erplab.com';

      mockConfigService.get
        .mockReturnValueOnce(frontendUrl)
        .mockReturnValueOnce(supportEmail);
      mockMailerService.sendMail.mockResolvedValue(undefined);

      await service.sendWelcomeEmail(email, nome);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: 'Bem-vindo ao ERP Lab',
        template: './welcome',
        context: {
          nome,
          temporaryPassword: undefined,
          loginUrl: `${frontendUrl}/login`,
          supportEmail,
        },
      });
    });

    it('should use default values when config values are not set', async () => {
      const email = 'user@example.com';
      const nome = 'João Silva';

      mockConfigService.get.mockImplementation(
        (key, defaultValue) => defaultValue,
      );
      mockMailerService.sendMail.mockResolvedValue(undefined);

      await service.sendWelcomeEmail(email, nome);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: 'Bem-vindo ao ERP Lab',
        template: './welcome',
        context: {
          nome,
          temporaryPassword: undefined,
          loginUrl: 'http://localhost:3000/login',
          supportEmail: 'suporte@erplab.com',
        },
      });
    });

    it('should handle mailer service errors', async () => {
      const email = 'user@example.com';
      const nome = 'João Silva';

      mockConfigService.get.mockImplementation(
        (key, defaultValue) => defaultValue,
      );
      mockMailerService.sendMail.mockRejectedValue(new Error('SMTP Error'));

      await expect(service.sendWelcomeEmail(email, nome)).rejects.toThrow(
        'SMTP Error',
      );
    });
  });
});
