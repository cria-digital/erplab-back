import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    dataSource = app.get(DataSource);

    // Limpar banco de dados de teste
    await dataSource.synchronize(true);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/setup (POST)', () => {
    it('deve criar o primeiro usuário do sistema', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/setup')
        .send({
          senha: 'Admin123!',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe('diegosoek@gmail.com');
          expect(res.body.cargo).toBe('Administrador do Sistema');
        });
    });

    it('deve falhar ao tentar criar segundo usuário via setup', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/setup')
        .send({
          senha: 'OutraSenha123!',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('já existe um usuário');
        });
    });
  });

  describe('/auth/login (POST)', () => {
    it('deve fazer login com credenciais válidas', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'diegosoek@gmail.com',
          password: 'Admin123!',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('refresh_token');
          expect(res.body).toHaveProperty('user');
          authToken = res.body.access_token;
          refreshToken = res.body.refresh_token;
        });
    });

    it('deve falhar com credenciais inválidas', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'diegosoek@gmail.com',
          password: 'SenhaErrada!',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('Credenciais inválidas');
        });
    });

    it('deve falhar com email não cadastrado', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'naocadastrado@example.com',
          password: 'Qualquer123!',
        })
        .expect(401);
    });

    it('deve validar formato do email', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'email-invalido',
          password: 'Qualquer123!',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('email');
        });
    });
  });

  describe('/auth/refresh (POST)', () => {
    it('deve gerar novo access token com refresh token válido', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({
          refresh_token: refreshToken,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body.access_token).not.toBe(authToken);
        });
    });

    it('deve falhar com refresh token inválido', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({
          refresh_token: 'token.invalido.aqui',
        })
        .expect(401);
    });

    it('deve falhar ao usar access token como refresh token', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({
          refresh_token: authToken, // Usando access token incorretamente
        })
        .expect(401);
    });
  });

  describe('/auth/me (GET)', () => {
    it('deve retornar dados do usuário autenticado', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe('diegosoek@gmail.com');
          expect(res.body).not.toHaveProperty('senha');
        });
    });

    it('deve falhar sem token de autenticação', () => {
      return request(app.getHttpServer()).get('/api/v1/auth/me').expect(401);
    });

    it('deve falhar com token inválido', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer token.invalido.aqui')
        .expect(401);
    });
  });

  describe('/auth/change-password (POST)', () => {
    it('deve alterar senha com senha atual correta', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          senhaAtual: 'Admin123!',
          novaSenha: 'NovaSenha123!',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toContain('alterada com sucesso');
        });
    });

    it('deve fazer login com a nova senha', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'diegosoek@gmail.com',
          password: 'NovaSenha123!',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
        });
    });

    it('deve falhar ao usar senha antiga', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'diegosoek@gmail.com',
          password: 'Admin123!',
        })
        .expect(401);
    });
  });

  describe('Teste de Bloqueio por Tentativas', () => {
    it('deve bloquear após 5 tentativas falhas', async () => {
      // Fazer 5 tentativas com senha errada
      for (let i = 0; i < 5; i++) {
        await request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send({
            email: 'diegosoek@gmail.com',
            password: 'SenhaErrada!',
          })
          .expect(401);
      }

      // 6ª tentativa deve retornar usuário bloqueado
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'diegosoek@gmail.com',
          password: 'NovaSenha123!', // Mesmo com senha correta
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('bloqueado');
        });
    });
  });
});
