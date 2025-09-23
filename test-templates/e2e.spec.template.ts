import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('ModuloController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;
  let testEntityId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    dataSource = app.get(DataSource);

    // Limpar e preparar banco de testes
    await dataSource.synchronize(true);

    // Setup inicial - criar usuário admin
    await request(app.getHttpServer())
      .post('/api/v1/auth/setup')
      .send({ senha: 'Admin123!' });

    // Login para obter token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'diegosoek@gmail.com',
        password: 'Admin123!',
      });

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/modulo (POST)', () => {
    it('deve criar uma nova entidade', () => {
      const createDto = {
        nome: 'Test Entity',
        descricao: 'Test Description',
        codigo: 'TEST001',
        ativo: true,
      };

      return request(app.getHttpServer())
        .post('/api/v1/modulo')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.nome).toBe(createDto.nome);
          expect(res.body.descricao).toBe(createDto.descricao);
          testEntityId = res.body.id;
        });
    });

    it('deve validar campos obrigatórios', () => {
      const invalidDto = {
        descricao: 'Missing required field',
      };

      return request(app.getHttpServer())
        .post('/api/v1/modulo')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDto)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('nome');
          expect(res.body.statusCode).toBe(400);
        });
    });

    it('deve rejeitar dados duplicados', () => {
      const duplicateDto = {
        nome: 'Test Entity', // Já existe
        descricao: 'Another description',
        codigo: 'TEST001', // Código duplicado
      };

      return request(app.getHttpServer())
        .post('/api/v1/modulo')
        .set('Authorization', `Bearer ${authToken}`)
        .send(duplicateDto)
        .expect(HttpStatus.CONFLICT)
        .expect((res) => {
          expect(res.body.message).toContain('já existe');
        });
    });

    it('deve rejeitar requisição sem autenticação', () => {
      return request(app.getHttpServer())
        .post('/api/v1/modulo')
        .send({ nome: 'Test' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('deve validar formato dos campos', () => {
      const invalidFormat = {
        nome: 'Te', // Muito curto
        email: 'invalid-email', // Email inválido
        cpf: '123', // CPF inválido
        data_nascimento: 'not-a-date', // Data inválida
      };

      return request(app.getHttpServer())
        .post('/api/v1/modulo')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidFormat)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toBeInstanceOf(Array);
          expect(res.body.message.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/api/v1/modulo (GET)', () => {
    it('deve listar entidades com paginação', () => {
      return request(app.getHttpServer())
        .get('/api/v1/modulo')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.meta).toHaveProperty('total');
          expect(res.body.meta).toHaveProperty('page');
          expect(res.body.meta).toHaveProperty('limit');
          expect(res.body.meta).toHaveProperty('totalPages');
        });
    });

    it('deve filtrar por busca de texto', () => {
      return request(app.getHttpServer())
        .get('/api/v1/modulo')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ search: 'Test' })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.data.length).toBeGreaterThan(0);
          expect(
            res.body.data.every((item) =>
              item.nome.toLowerCase().includes('test'),
            ),
          ).toBe(true);
        });
    });

    it('deve filtrar por status', () => {
      return request(app.getHttpServer())
        .get('/api/v1/modulo')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ ativo: true })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.data.every((item) => item.ativo)).toBe(true);
        });
    });

    it('deve ordenar resultados', () => {
      return request(app.getHttpServer())
        .get('/api/v1/modulo')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ orderBy: 'nome', order: 'ASC' })
        .expect(HttpStatus.OK)
        .expect((res) => {
          const nomes = res.body.data.map((item) => item.nome);
          const sorted = [...nomes].sort();
          expect(nomes).toEqual(sorted);
        });
    });

    it('deve retornar vazio quando não houver dados', () => {
      return request(app.getHttpServer())
        .get('/api/v1/modulo')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ search: 'NonExistentSearchTerm123456' })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.data).toEqual([]);
          expect(res.body.meta.total).toBe(0);
        });
    });
  });

  describe('/api/v1/modulo/:id (GET)', () => {
    it('deve retornar uma entidade pelo ID', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/modulo/${testEntityId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.id).toBe(testEntityId);
          expect(res.body).toHaveProperty('nome');
          expect(res.body).toHaveProperty('descricao');
        });
    });

    it('deve retornar 404 para ID inexistente', () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer())
        .get(`/api/v1/modulo/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect((res) => {
          expect(res.body.message).toContain('não encontrado');
        });
    });

    it('deve validar formato do UUID', () => {
      return request(app.getHttpServer())
        .get('/api/v1/modulo/invalid-uuid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('deve incluir relações quando solicitado', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/modulo/${testEntityId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({ include: 'relacoes' })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('relacoes');
        });
    });
  });

  describe('/api/v1/modulo/:id (PATCH)', () => {
    it('deve atualizar uma entidade', () => {
      const updateDto = {
        descricao: 'Updated Description',
      };

      return request(app.getHttpServer())
        .patch(`/api/v1/modulo/${testEntityId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.id).toBe(testEntityId);
          expect(res.body.descricao).toBe(updateDto.descricao);
        });
    });

    it('deve retornar 404 ao atualizar entidade inexistente', () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer())
        .patch(`/api/v1/modulo/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ descricao: 'New' })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('deve validar dados do update', () => {
      const invalidUpdate = {
        email: 'not-an-email',
        cpf: '123',
      };

      return request(app.getHttpServer())
        .patch(`/api/v1/modulo/${testEntityId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidUpdate)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('deve ignorar campos não permitidos no update', () => {
      const updateDto = {
        id: 'new-id', // Should be ignored
        created_at: new Date(), // Should be ignored
        descricao: 'Valid update',
      };

      return request(app.getHttpServer())
        .patch(`/api/v1/modulo/${testEntityId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.id).toBe(testEntityId); // ID não mudou
          expect(res.body.descricao).toBe(updateDto.descricao);
        });
    });
  });

  describe('/api/v1/modulo/:id (DELETE)', () => {
    it('deve remover uma entidade (soft delete)', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/modulo/${testEntityId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.message).toContain('removido com sucesso');
        });
    });

    it('deve confirmar que entidade foi marcada como inativa', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/modulo/${testEntityId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.body.ativo).toBe(false);
    });

    it('deve retornar 404 ao remover entidade inexistente', () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer())
        .delete(`/api/v1/modulo/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('deve impedir remoção de entidade com dependências', async () => {
      // Criar entidade com dependências
      const parentResponse = await request(app.getHttpServer())
        .post('/api/v1/modulo')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Parent Entity',
          descricao: 'Has dependencies',
        });

      const parentId = parentResponse.body.id;

      // Tentar remover deve falhar
      return request(app.getHttpServer())
        .delete(`/api/v1/modulo/${parentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.CONFLICT)
        .expect((res) => {
          expect(res.body.message).toContain('dependências');
        });
    });
  });

  describe('Testes de Segurança', () => {
    it('deve rejeitar token expirado', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Token expirado

      return request(app.getHttpServer())
        .get('/api/v1/modulo')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('deve rejeitar token malformado', () => {
      return request(app.getHttpServer())
        .get('/api/v1/modulo')
        .set('Authorization', 'Bearer malformed.token.here')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('deve prevenir SQL injection', () => {
      const sqlInjection = "'; DROP TABLE users; --";

      return request(app.getHttpServer())
        .get('/api/v1/modulo')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ search: sqlInjection })
        .expect(HttpStatus.OK)
        .expect((res) => {
          // Should return empty results, not execute SQL
          expect(res.body.data).toBeDefined();
        });
    });

    it('deve limitar tamanho do payload', () => {
      const largePayload = {
        nome: 'Test',
        descricao: 'x'.repeat(10000000), // 10MB string
      };

      return request(app.getHttpServer())
        .post('/api/v1/modulo')
        .set('Authorization', `Bearer ${authToken}`)
        .send(largePayload)
        .expect(HttpStatus.PAYLOAD_TOO_LARGE);
    });
  });

  describe('Testes de Performance', () => {
    it('deve responder em tempo aceitável para listagem', async () => {
      const startTime = Date.now();

      await request(app.getHttpServer())
        .get('/api/v1/modulo')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 100 })
        .expect(HttpStatus.OK);

      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000); // Menos de 1 segundo
    });

    it('deve paginar corretamente grandes volumes', async () => {
      // Criar múltiplas entidades
      const promises = [];
      for (let i = 0; i < 50; i++) {
        promises.push(
          request(app.getHttpServer())
            .post('/api/v1/modulo')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
              nome: `Entity ${i}`,
              descricao: `Description ${i}`,
            }),
        );
      }
      await Promise.all(promises);

      // Testar paginação
      const page1 = await request(app.getHttpServer())
        .get('/api/v1/modulo')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 });

      const page2 = await request(app.getHttpServer())
        .get('/api/v1/modulo')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 2, limit: 10 });

      expect(page1.body.data.length).toBe(10);
      expect(page2.body.data.length).toBe(10);
      expect(page1.body.data[0].id).not.toBe(page2.body.data[0].id);
    });
  });
});
