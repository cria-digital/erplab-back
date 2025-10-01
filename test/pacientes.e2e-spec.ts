import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('PacientesController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;
  let pacienteId: string;
  let empresaId: string;

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

    // Criar empresa para testes
    const empresaResponse = await request(app.getHttpServer())
      .post('/api/v1/empresas')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        tipoEmpresa: 'CONVENIOS',
        cnpj: '12.345.678/0001-90',
        razaoSocial: 'Empresa Teste LTDA',
        nomeFantasia: 'Empresa Teste',
        emailComercial: 'contato@empresateste.com.br',
      });

    empresaId = empresaResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  // ==================== POST ====================
  describe('/api/v1/pacientes (POST)', () => {
    it('deve criar novo paciente', () => {
      return request(app.getHttpServer())
        .post('/api/v1/pacientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'João da Silva Santos',
          sexo: 'M',
          data_nascimento: '1990-01-15',
          nome_mae: 'Maria da Silva Santos',
          rg: '12.345.678-9',
          cpf: '12345678901',
          estado_civil: 'Solteiro',
          email: 'joao.silva@email.com',
          contatos: '11999999999',
          profissao: 'Engenheiro Civil',
          cep: '01310100',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          empresa_id: empresaId,
        })
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data.nome).toBe('João da Silva Santos');
          expect(res.body.data.cpf).toBe('12345678901');
          pacienteId = res.body.data.id;
        });
    });

    it('deve validar campos obrigatórios', () => {
      return request(app.getHttpServer())
        .post('/api/v1/pacientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          // Enviando dados incompletos
          nome: 'Test',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(Array.isArray(res.body.message)).toBe(true);
        });
    });

    it('deve falhar sem autenticação', () => {
      return request(app.getHttpServer())
        .post('/api/v1/pacientes')
        .send({
          nome: 'Test Patient',
          cpf: '98765432109',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('deve validar CPF duplicado', () => {
      return request(app.getHttpServer())
        .post('/api/v1/pacientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Outro Paciente',
          sexo: 'F',
          data_nascimento: '1985-05-20',
          nome_mae: 'Ana Maria Santos',
          rg: '98.765.432-1',
          cpf: '12345678901', // CPF já usado no primeiro teste
          estado_civil: 'Casada',
          email: 'outro@email.com',
          contatos: '11988888888',
          profissao: 'Médica',
          cep: '01310100',
          numero: '456',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          empresa_id: empresaId,
        })
        .expect(HttpStatus.CONFLICT);
    });

    it('deve validar formato do CPF', () => {
      return request(app.getHttpServer())
        .post('/api/v1/pacientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Test Paciente',
          sexo: 'M',
          data_nascimento: '1990-01-15',
          nome_mae: 'Maria Test',
          rg: '12.345.678-9',
          cpf: '123', // CPF inválido
          estado_civil: 'Solteiro',
          email: 'test@email.com',
          contatos: '11999999999',
          profissao: 'Test',
          cep: '01310100',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          empresa_id: empresaId,
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  // ==================== GET ====================
  describe('/api/v1/pacientes (GET)', () => {
    it('deve listar todos os pacientes', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pacientes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('limit');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    it('deve filtrar por nome', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pacientes')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ nome: 'João' })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          if (res.body.data.length > 0) {
            expect(
              res.body.data.some(
                (p) => p.nome && p.nome.toLowerCase().includes('joão'),
              ),
            ).toBe(true);
          }
        });
    });

    it('deve paginar resultados', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pacientes')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 5 })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.page).toBe(1);
          expect(res.body.limit).toBe(5);
          expect(res.body.data.length).toBeLessThanOrEqual(5);
        });
    });
  });

  describe('/api/v1/pacientes/search (GET)', () => {
    it('deve buscar pacientes por nome', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pacientes/search')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ nome: 'João' })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/api/v1/pacientes/stats (GET)', () => {
    it('deve retornar estatísticas', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pacientes/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('status');
        });
    });
  });

  describe('/api/v1/pacientes/:id (GET)', () => {
    it('deve buscar paciente por ID', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/pacientes/${pacienteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.id).toBe(pacienteId);
          expect(res.body.nome).toBe('João da Silva Santos');
        });
    });

    it('deve retornar 404 para ID inexistente', () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer())
        .get(`/api/v1/pacientes/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/api/v1/pacientes/cpf/:cpf (GET)', () => {
    it('deve buscar paciente por CPF', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pacientes/cpf/12345678901')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.cpf).toBe('12345678901');
          expect(res.body.nome).toBe('João da Silva Santos');
        });
    });

    it('deve retornar null para CPF inexistente', () => {
      return request(app.getHttpServer())
        .get('/api/v1/pacientes/cpf/99999999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toBeNull();
        });
    });
  });

  // ==================== PATCH ====================
  describe('/api/v1/pacientes/:id (PATCH)', () => {
    it('deve atualizar paciente', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/pacientes/${pacienteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          profissao: 'Engenheiro de Software',
          email: 'joao.silva.novo@email.com',
        })
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.data.profissao).toBe('Engenheiro de Software');
          expect(res.body.data.email).toBe('joao.silva.novo@email.com');
        });
    });

    it('deve retornar 404 ao atualizar paciente inexistente', () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer())
        .patch(`/api/v1/pacientes/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ profissao: 'Novo' })
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/api/v1/pacientes/:id/activate (PATCH)', () => {
    it('deve ativar paciente', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/pacientes/${pacienteId}/activate`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.data.status).toBe('ativo');
        });
    });
  });

  describe('/api/v1/pacientes/:id/block (PATCH)', () => {
    it('deve bloquear paciente', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/pacientes/${pacienteId}/block`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.data.status).toBe('bloqueado');
        });
    });
  });

  // ==================== DELETE ====================
  describe('/api/v1/pacientes/:id (DELETE)', () => {
    it('deve remover paciente', async () => {
      // Criar um paciente para deletar
      const createRes = await request(app.getHttpServer())
        .post('/api/v1/pacientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Paciente Para Deletar',
          sexo: 'F',
          data_nascimento: '1995-03-10',
          nome_mae: 'Mae do Paciente',
          rg: '11.111.111-1',
          cpf: '11111111111',
          estado_civil: 'Solteira',
          email: 'deletar@email.com',
          contatos: '11977777777',
          profissao: 'Test',
          cep: '01310100',
          numero: '999',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          empresa_id: empresaId,
        });

      await request(app.getHttpServer())
        .delete(`/api/v1/pacientes/${createRes.body.data.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('removido com sucesso');
        });
    });

    it('deve retornar 404 ao deletar paciente inexistente', () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      return request(app.getHttpServer())
        .delete(`/api/v1/pacientes/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
