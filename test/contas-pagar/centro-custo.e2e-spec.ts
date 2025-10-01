import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';

describe('CentroCustoController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;
  let centroCustoId: string;
  let unidadeId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    dataSource = app.get(DataSource);

    // Limpar banco de dados de teste
    await dataSource.synchronize(true);

    // Criar usuário e fazer login
    await request(app.getHttpServer())
      .post('/api/v1/auth/setup')
      .send({ senha: 'Admin123!' });

    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'diegosoek@gmail.com',
        password: 'Admin123!',
      });

    authToken = loginResponse.body.access_token;

    // Criar uma unidade de saúde para usar nos testes
    const unidadeResponse = await request(app.getHttpServer())
      .post('/api/v1/unidades-saude')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nomeUnidade: 'Unidade Teste E2E',
        cnpj: '12345678000199',
        razaoSocial: 'Unidade Teste Ltda',
        nomeFantasia: 'Unidade Teste',
      });

    unidadeId = unidadeResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/centros-custo (POST)', () => {
    it('deve criar um novo centro de custo', () => {
      return request(app.getHttpServer())
        .post('/api/v1/centros-custo')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          codigo: 'CC001',
          nome: 'Administrativo',
          descricao: 'Despesas administrativas',
          unidadeId: unidadeId,
          ativo: true,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.codigo).toBe('CC001');
          expect(res.body.nome).toBe('Administrativo');
          expect(res.body.ativo).toBe(true);
          centroCustoId = res.body.id;
        });
    });

    it('deve falhar ao criar centro de custo com código duplicado', () => {
      return request(app.getHttpServer())
        .post('/api/v1/centros-custo')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          codigo: 'CC001',
          nome: 'Outro Centro',
          descricao: 'Teste duplicado',
        })
        .expect(409)
        .expect((res) => {
          expect(res.body.message).toContain('Já existe');
        });
    });

    it('deve validar campos obrigatórios', () => {
      return request(app.getHttpServer())
        .post('/api/v1/centros-custo')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          codigo: 'CC002',
          // faltando nome
        })
        .expect(400);
    });

    it('deve falhar sem autenticação', () => {
      return request(app.getHttpServer())
        .post('/api/v1/centros-custo')
        .send({
          codigo: 'CC003',
          nome: 'Teste',
        })
        .expect(401);
    });
  });

  describe('/centros-custo (GET)', () => {
    it('deve listar todos os centros de custo', () => {
      return request(app.getHttpServer())
        .get('/api/v1/centros-custo')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('codigo');
          expect(res.body[0]).toHaveProperty('nome');
        });
    });

    it('deve listar apenas centros ativos', () => {
      return request(app.getHttpServer())
        .get('/api/v1/centros-custo/ativos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((centro) => {
            expect(centro.ativo).toBe(true);
          });
        });
    });
  });

  describe('/centros-custo/:id (GET)', () => {
    it('deve buscar centro de custo por ID', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/centros-custo/${centroCustoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(centroCustoId);
          expect(res.body.codigo).toBe('CC001');
          expect(res.body).toHaveProperty('unidade');
        });
    });

    it('deve retornar 404 para ID inexistente', () => {
      return request(app.getHttpServer())
        .get('/api/v1/centros-custo/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('deve validar formato UUID', () => {
      return request(app.getHttpServer())
        .get('/api/v1/centros-custo/invalid-uuid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });
  });

  describe('/centros-custo/:id (PATCH)', () => {
    it('deve atualizar centro de custo', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/centros-custo/${centroCustoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Administrativo Atualizado',
          descricao: 'Descrição atualizada',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.nome).toBe('Administrativo Atualizado');
          expect(res.body.descricao).toBe('Descrição atualizada');
          expect(res.body.codigo).toBe('CC001'); // código não muda
        });
    });

    it('deve validar código único ao atualizar', async () => {
      // Criar outro centro
      const outro = await request(app.getHttpServer())
        .post('/api/v1/centros-custo')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          codigo: 'CC999',
          nome: 'Outro Centro',
        });

      // Tentar atualizar com código existente
      return request(app.getHttpServer())
        .patch(`/api/v1/centros-custo/${outro.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          codigo: 'CC001', // já existe
        })
        .expect(409);
    });
  });

  describe('/centros-custo/:id/toggle-status (PATCH)', () => {
    it('deve alternar status do centro de custo', async () => {
      // Verificar status atual
      const antes = await request(app.getHttpServer())
        .get(`/api/v1/centros-custo/${centroCustoId}`)
        .set('Authorization', `Bearer ${authToken}`);

      const statusAntes = antes.body.ativo;

      // Alternar status
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/centros-custo/${centroCustoId}/toggle-status`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.ativo).toBe(!statusAntes);

      // Alternar novamente
      const response2 = await request(app.getHttpServer())
        .patch(`/api/v1/centros-custo/${centroCustoId}/toggle-status`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response2.body.ativo).toBe(statusAntes);
    });
  });

  describe('/centros-custo/:id (DELETE)', () => {
    it('deve remover centro de custo', async () => {
      // Criar centro para deletar
      const centro = await request(app.getHttpServer())
        .post('/api/v1/centros-custo')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          codigo: 'CC_DELETE',
          nome: 'Centro para Deletar',
        });

      // Deletar
      await request(app.getHttpServer())
        .delete(`/api/v1/centros-custo/${centro.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verificar que foi deletado
      await request(app.getHttpServer())
        .get(`/api/v1/centros-custo/${centro.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('deve retornar 404 ao deletar ID inexistente', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/centros-custo/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
