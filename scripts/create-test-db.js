#!/usr/bin/env node

const { Client } = require('pg');
const { config } = require('dotenv');
const { resolve } = require('path');

// Carregar variáveis do .env
config({ path: resolve(__dirname, '../.env') });

const TEST_DB = 'erplab_db_test';

async function createTestDatabase() {
  // Conectar no banco postgres (padrão) para criar o banco de teste
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USERNAME || 'nestuser',
    password: process.env.DB_PASSWORD || 'nestpass',
    database: 'postgres', // Conecta no banco padrão
  });

  try {
    console.log('🧪 Criando banco de dados de teste...');
    console.log('======================================');
    console.log(`📡 Host: ${client.host}`);
    console.log(`👤 Usuário: ${client.user}`);
    console.log('');

    await client.connect();

    // Verificar se o banco já existe
    const checkResult = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [TEST_DB]
    );

    if (checkResult.rows.length > 0) {
      console.log(`⚠️  Banco de dados '${TEST_DB}' já existe.`);
      console.log('');
      process.exit(0);
    }

    // Criar banco de dados
    console.log(`📦 Criando banco '${TEST_DB}'...`);
    await client.query(`CREATE DATABASE ${TEST_DB}`);

    console.log('✅ Banco de dados de teste criado com sucesso!');
    console.log('');
    console.log('Próximos passos:');
    console.log('  1. NODE_ENV=test npm run migration:run');
    console.log('  2. npm run test:e2e');
    console.log('');

  } catch (error) {
    console.error('❌ Erro ao criar banco de dados:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createTestDatabase();
