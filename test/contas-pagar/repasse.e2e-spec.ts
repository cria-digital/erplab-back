import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import {
  EntidadeTipoFiltro,
  StatusRepasse,
} from '../../src/modules/financeiro/core/contas-pagar/enums/contas-pagar.enum';

describe('RepasseController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;
  let repasseId: string;
  let unidadeId: string;
  let profissionalId: string;
  let exameId: string;

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

    // Criar unidade de saúde
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

    // Criar profissional
    const profissionalResponse = await request(app.getHttpServer())
      .post('/api/v1/profissionais')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nomeCompleto: 'Dr. João Silva',
        cpf: '12345678901',
        email: 'joao@teste.com',
        telefone: '11999999999',
        especialidade: 'Cardiologia',
        numeroConselho: 'CRM-123456',
        tipoConselho: 'CRM',
        ufConselho: 'SP',
      });

    profissionalId = profissionalResponse.body.id;

    // Criar exame
    const exameResponse = await request(app.getHttpServer())
      .post('/api/v1/exames')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        codigo: 'EXAM001',
        nome: 'Hemograma Completo',
        descricao: 'Exame de sangue completo',
        categoria: 'LABORATORIAL',
        ativo: true,
      });

    exameId = exameResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/repasses (POST)', () => {
    it('deve criar um novo repasse', () => {
      return request(app.getHttpServer())
        .post('/api/v1/repasses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          dataInicio: '2025-09-01',
          dataFim: '2025-09-30',
          unidadeId: unidadeId,
          descricao: 'Repasse de Setembro 2025',
          status: StatusRepasse.ATIVO,
          filtros: [
            {
              entidadeTipo: EntidadeTipoFiltro.MEDICO,
              entidadeId: profissionalId,
            },
          ],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.descricao).toBe('Repasse de Setembro 2025');
          expect(res.body.status).toBe(StatusRepasse.ATIVO);
          expect(res.body.filtros).toBeDefined();
          expect(res.body.filtros.length).toBe(1);
          repasseId = res.body.id;
        });
    });

    it('deve criar repasse com múltiplos filtros', () => {
      return request(app.getHttpServer())
        .post('/api/v1/repasses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          dataInicio: '2025-10-01',
          dataFim: '2025-10-31',
          unidadeId: unidadeId,
          descricao: 'Repasse de Outubro 2025',
          filtros: [
            {
              entidadeTipo: EntidadeTipoFiltro.MEDICO,
              entidadeId: profissionalId,
            },
            {
              entidadeTipo: EntidadeTipoFiltro.EXAME,
              entidadeId: exameId,
            },
          ],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.filtros.length).toBe(2);
        });
    });

    it('deve validar campos obrigatórios', () => {
      return request(app.getHttpServer())
        .post('/api/v1/repasses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          dataInicio: '2025-09-01',
          // faltando dataFim
        })
        .expect(400);
    });

    it('deve falhar sem autenticação', () => {
      return request(app.getHttpServer())
        .post('/api/v1/repasses')
        .send({
          dataInicio: '2025-09-01',
          dataFim: '2025-09-30',
          unidadeId: unidadeId,
        })
        .expect(401);
    });
  });

  describe('/repasses (GET)', () => {
    it('deve listar todos os repasses', () => {
      return request(app.getHttpServer())
        .get('/api/v1/repasses')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('dataInicio');
          expect(res.body[0]).toHaveProperty('dataFim');
          expect(res.body[0]).toHaveProperty('filtros');
        });
    });

    it('deve listar apenas repasses ativos', () => {
      return request(app.getHttpServer())
        .get('/api/v1/repasses/ativos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((repasse) => {
            expect(repasse.status).toBe(StatusRepasse.ATIVO);
          });
        });
    });
  });

  describe('/repasses/:id (GET)', () => {
    it('deve buscar repasse por ID', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/repasses/${repasseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(repasseId);
          expect(res.body).toHaveProperty('unidade');
          expect(res.body).toHaveProperty('filtros');
        });
    });

    it('deve retornar 404 para ID inexistente', () => {
      return request(app.getHttpServer())
        .get('/api/v1/repasses/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('deve validar formato UUID', () => {
      return request(app.getHttpServer())
        .get('/api/v1/repasses/invalid-uuid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });
  });

  describe('/repasses/unidade/:id (GET)', () => {
    it('deve listar repasses por unidade', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/repasses/unidade/${unidadeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((repasse) => {
            expect(repasse.unidadeId).toBe(unidadeId);
          });
        });
    });
  });

  describe('/repasses/periodo (GET)', () => {
    it('deve listar repasses por período', () => {
      return request(app.getHttpServer())
        .get('/api/v1/repasses/periodo')
        .query({ dataInicio: '2025-09-01', dataFim: '2025-09-30' })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/repasses/:id (PATCH)', () => {
    it('deve atualizar repasse', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/repasses/${repasseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          descricao: 'Repasse Atualizado',
          status: StatusRepasse.PROCESSADO,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.descricao).toBe('Repasse Atualizado');
          expect(res.body.status).toBe(StatusRepasse.PROCESSADO);
        });
    });
  });

  describe('/repasses/:id/toggle-status (PATCH)', () => {
    it('deve alternar status do repasse', async () => {
      // Verificar status atual
      const antes = await request(app.getHttpServer())
        .get(`/api/v1/repasses/${repasseId}`)
        .set('Authorization', `Bearer ${authToken}`);

      const statusAntes = antes.body.status;

      // Alternar status
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/repasses/${repasseId}/toggle-status`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).not.toBe(statusAntes);

      // Alternar novamente
      const response2 = await request(app.getHttpServer())
        .patch(`/api/v1/repasses/${repasseId}/toggle-status`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response2.body.status).toBe(statusAntes);
    });
  });

  describe('/repasses/:id (DELETE)', () => {
    it('deve remover repasse', async () => {
      // Criar repasse para deletar
      const repasse = await request(app.getHttpServer())
        .post('/api/v1/repasses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          dataInicio: '2025-11-01',
          dataFim: '2025-11-30',
          unidadeId: unidadeId,
          descricao: 'Repasse para Deletar',
          filtros: [
            {
              entidadeTipo: EntidadeTipoFiltro.MEDICO,
              entidadeId: profissionalId,
            },
          ],
        });

      // Deletar
      await request(app.getHttpServer())
        .delete(`/api/v1/repasses/${repasse.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verificar que foi deletado
      await request(app.getHttpServer())
        .get(`/api/v1/repasses/${repasse.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('deve retornar 404 ao deletar ID inexistente', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/repasses/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
