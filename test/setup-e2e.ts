import { config } from 'dotenv';
import { resolve } from 'path';

// Carregar variáveis de ambiente do arquivo .env.test
config({ path: resolve(__dirname, '../.env.test') });

// Garantir que estamos em modo de teste
process.env.NODE_ENV = 'test';

console.log('\n🧪 Configuração de Teste E2E');
console.log('================================');
console.log(`📦 Banco de Dados: ${process.env.DB_DATABASE}`);
console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
console.log('================================\n');

// Validação de segurança: garantir que não estamos usando o banco de produção
if (
  process.env.DB_DATABASE === 'erplab_db' &&
  process.env.NODE_ENV === 'test'
) {
  console.error('🚨 ERRO: Tentando usar banco de PRODUÇÃO em testes!');
  console.error('Configure DB_DATABASE=erplab_db_test no .env.test');
  process.exit(1);
}

if (!process.env.DB_DATABASE?.includes('test')) {
  console.warn(
    '⚠️  AVISO: O nome do banco não contém "test". Isso pode ser perigoso!',
  );
  console.warn(`   Banco atual: ${process.env.DB_DATABASE}`);
}
