import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import {
  CredorTipo,
  TipoDocumento,
  StatusContaPagar,
  TipoImposto,
} from '../../src/modules/financeiro/core/contas-pagar/enums/contas-pagar.enum';

describe('ContaPagarController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;
  let contaPagarId: string;
  let unidadeId: string;
  let empresaId: string;
  let contaContabilId: string;
  let centroCustoId: string;

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

    // Criar empresa (credor)
    const empresaResponse = await request(app.getHttpServer())
      .post('/api/v1/empresas')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        cnpj: '98765432000188',
        razaoSocial: 'Fornecedor Teste Ltda',
        nomeFantasia: 'Fornecedor Teste',
        inscricaoEstadual: '123456789',
        email: 'fornecedor@teste.com',
        telefone: '11999999999',
      });

    empresaId = empresaResponse.body.id;

    // Criar conta contábil
    const contaContabilResponse = await request(app.getHttpServer())
      .post('/api/v1/contas-contabeis')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        codigo: 'CC001',
        nome: 'Despesas Administrativas',
        tipo: 'DESPESA',
      });

    contaContabilId = contaContabilResponse.body.id;

    // Criar centro de custo
    const centroCustoResponse = await request(app.getHttpServer())
      .post('/api/v1/centros-custo')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        codigo: 'CC001',
        nome: 'Administrativo',
        unidadeId: unidadeId,
        ativo: true,
      });

    centroCustoId = centroCustoResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/contas-pagar (POST)', () => {
    it('deve criar uma nova conta a pagar completa', () => {
      return request(app.getHttpServer())
        .post('/api/v1/contas-pagar')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          credorTipo: CredorTipo.FORNECEDOR,
          credorId: empresaId,
          unidadeDevedoraId: unidadeId,
          tipoDocumento: TipoDocumento.NOTA_FISCAL,
          numeroDocumento: 'NF-001',
          descricao: 'Compra de material',
          valorBruto: 1000.0,
          valorLiquido: 900.0,
          competencia: '2025-09',
          dataEmissao: '2025-09-15',
          status: StatusContaPagar.A_PAGAR,
          composicoesFinanceiras: [
            {
              contaContabilId: contaContabilId,
              centroCustoId: centroCustoId,
              valor: 900.0,
              descricao: 'Material administrativo',
            },
          ],
          impostosRetidos: [
            {
              tipoImposto: TipoImposto.ISS,
              aliquota: 5.0,
              valorBase: 1000.0,
              valorRetido: 50.0,
            },
          ],
          parcelas: [
            {
              numeroParcela: 1,
              dataVencimento: '2025-10-15',
              valor: 900.0,
            },
          ],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('codigoInterno');
          expect(res.body.valorBruto).toBe(1000);
          expect(res.body.valorLiquido).toBe(900);
          expect(res.body.status).toBe(StatusContaPagar.A_PAGAR);
          contaPagarId = res.body.id;
        });
    });

    it('deve gerar código interno automaticamente', () => {
      return request(app.getHttpServer())
        .post('/api/v1/contas-pagar')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          credorTipo: CredorTipo.FORNECEDOR,
          credorId: empresaId,
          unidadeDevedoraId: unidadeId,
          tipoDocumento: TipoDocumento.RECIBO,
          numeroDocumento: 'REC-001',
          descricao: 'Serviço de manutenção',
          valorBruto: 500.0,
          valorLiquido: 500.0,
          competencia: '2025-09',
          dataEmissao: '2025-09-20',
          status: StatusContaPagar.A_PAGAR,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.codigoInterno).toMatch(/^CAP\d{8}$/);
        });
    });

    it('deve validar campos obrigatórios', () => {
      return request(app.getHttpServer())
        .post('/api/v1/contas-pagar')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          credorTipo: CredorTipo.FORNECEDOR,
          // faltando credorId
        })
        .expect(400);
    });

    it('deve falhar sem autenticação', () => {
      return request(app.getHttpServer())
        .post('/api/v1/contas-pagar')
        .send({
          credorTipo: CredorTipo.FORNECEDOR,
          credorId: empresaId,
        })
        .expect(401);
    });
  });

  describe('/contas-pagar (GET)', () => {
    it('deve listar todas as contas a pagar', () => {
      return request(app.getHttpServer())
        .get('/api/v1/contas-pagar')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('codigoInterno');
          expect(res.body[0]).toHaveProperty('unidadeDevedora');
        });
    });
  });

  describe('/contas-pagar/:id (GET)', () => {
    it('deve buscar conta a pagar por ID', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/contas-pagar/${contaPagarId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(contaPagarId);
          expect(res.body).toHaveProperty('composicoesFinanceiras');
          expect(res.body).toHaveProperty('impostosRetidos');
          expect(res.body).toHaveProperty('parcelas');
        });
    });

    it('deve retornar 404 para ID inexistente', () => {
      return request(app.getHttpServer())
        .get('/api/v1/contas-pagar/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/contas-pagar/status/:status (GET)', () => {
    it('deve filtrar contas por status', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/contas-pagar/status/${StatusContaPagar.A_PAGAR}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((conta) => {
            expect(conta.status).toBe(StatusContaPagar.A_PAGAR);
          });
        });
    });
  });

  describe('/contas-pagar/credor/:tipo/:id (GET)', () => {
    it('deve filtrar contas por credor', () => {
      return request(app.getHttpServer())
        .get(
          `/api/v1/contas-pagar/credor/${CredorTipo.FORNECEDOR}/${empresaId}`,
        )
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((conta) => {
            expect(conta.credorTipo).toBe(CredorTipo.FORNECEDOR);
            expect(conta.credorId).toBe(empresaId);
          });
        });
    });
  });

  describe('/contas-pagar/:id (PATCH)', () => {
    it('deve atualizar conta a pagar', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/contas-pagar/${contaPagarId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          descricao: 'Descrição atualizada',
          observacoes: 'Nova observação',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.descricao).toBe('Descrição atualizada');
          expect(res.body.observacoes).toBe('Nova observação');
        });
    });
  });

  describe('/contas-pagar/:id/status (PATCH)', () => {
    it('deve atualizar status da conta', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/contas-pagar/${contaPagarId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: StatusContaPagar.AGENDADA,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(StatusContaPagar.AGENDADA);
        });
    });
  });

  describe('/contas-pagar/:id (DELETE)', () => {
    it('deve remover conta a pagar', async () => {
      // Criar conta para deletar
      const conta = await request(app.getHttpServer())
        .post('/api/v1/contas-pagar')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          credorTipo: CredorTipo.FORNECEDOR,
          credorId: empresaId,
          unidadeDevedoraId: unidadeId,
          tipoDocumento: TipoDocumento.RECIBO,
          numeroDocumento: 'REC-DELETE',
          descricao: 'Conta para deletar',
          valorBruto: 100.0,
          valorLiquido: 100.0,
          competencia: '2025-09',
          dataEmissao: '2025-09-25',
          status: StatusContaPagar.A_PAGAR,
        });

      // Deletar
      await request(app.getHttpServer())
        .delete(`/api/v1/contas-pagar/${conta.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verificar que foi deletado
      await request(app.getHttpServer())
        .get(`/api/v1/contas-pagar/${conta.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('deve retornar 404 ao deletar ID inexistente', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/contas-pagar/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
