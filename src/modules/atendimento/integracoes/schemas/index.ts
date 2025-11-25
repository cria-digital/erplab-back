import { HERMES_PARDINI_SCHEMA } from './hermes-pardini.schema';
import { IntegracaoSchema, ProtocoloIntegracao } from './types';
import { TipoIntegracao } from '../entities/integracao.entity';

/**
 * Registro de todos os schemas de integrações disponíveis
 *
 * Para adicionar nova integração:
 * 1. Criar arquivo [nome].schema.ts
 * 2. Adicionar ao INTEGRACOES_SCHEMAS abaixo
 * 3. Exportar no final do arquivo
 */
export const INTEGRACOES_SCHEMAS: Record<string, IntegracaoSchema> = {
  'hermes-pardini': HERMES_PARDINI_SCHEMA,
  // Adicionar novos schemas aqui...
  // 'santander-api': SANTANDER_SCHEMA,
  // 'orizon-tiss': ORIZON_TISS_SCHEMA,
};

// ==========================================
// HELPERS
// ==========================================

/**
 * Busca schema por slug
 */
export function getSchemaBySlug(slug: string): IntegracaoSchema | undefined {
  return INTEGRACOES_SCHEMAS[slug];
}

/**
 * Lista todos os schemas ativos
 */
export function getAllSchemas(): IntegracaoSchema[] {
  return Object.values(INTEGRACOES_SCHEMAS).filter((s) => s.ativo);
}

/**
 * Filtra schemas por tipo de contexto
 */
export function getSchemasByTipo(tipo: TipoIntegracao): IntegracaoSchema[] {
  return getAllSchemas().filter((schema) =>
    schema.tipos_contexto.includes(tipo),
  );
}

/**
 * Filtra schemas por protocolo
 */
export function getSchemasByProtocolo(
  protocolo: ProtocoloIntegracao,
): IntegracaoSchema[] {
  return getAllSchemas().filter((schema) => schema.protocolo === protocolo);
}

/**
 * Busca schemas por termo (nome ou descrição)
 */
export function searchSchemas(termo: string): IntegracaoSchema[] {
  const termoLower = termo.toLowerCase();
  return getAllSchemas().filter(
    (schema) =>
      schema.nome.toLowerCase().includes(termoLower) ||
      schema.descricao.toLowerCase().includes(termoLower) ||
      schema.slug.includes(termoLower),
  );
}

/**
 * Lista todos os slugs disponíveis
 */
export function getAllSlugs(): string[] {
  return Object.keys(INTEGRACOES_SCHEMAS);
}

/**
 * Valida se um slug existe
 */
export function isValidSlug(slug: string): boolean {
  return slug in INTEGRACOES_SCHEMAS;
}

// ==========================================
// EXPORTS
// ==========================================

export * from './types';
export { HERMES_PARDINI_SCHEMA } from './hermes-pardini.schema';
