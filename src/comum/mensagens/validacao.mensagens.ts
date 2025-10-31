/**
 * Mensagens de validação padronizadas em português
 * Para uso com decorators do class-validator
 */

export const MensagensValidacao = {
  // Mensagens gerais
  CAMPO_OBRIGATORIO: (campo: string) => `O campo ${campo} é obrigatório`,
  CAMPO_INVALIDO: (campo: string) => `O campo ${campo} está inválido`,
  CAMPO_VAZIO: (campo: string) => `O campo ${campo} não pode estar vazio`,

  // Email
  EMAIL_INVALIDO: 'O e-mail informado é inválido',
  EMAIL_OBRIGATORIO: 'O e-mail é obrigatório',

  // Senha
  SENHA_OBRIGATORIA: 'A senha é obrigatória',
  SENHA_MINIMA: (min: number) => `A senha deve ter no mínimo ${min} caracteres`,
  SENHA_MAXIMA: (max: number) => `A senha deve ter no máximo ${max} caracteres`,
  SENHA_FRACA:
    'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
  SENHAS_NAO_COINCIDEM: 'As senhas não coincidem',
  SENHA_ATUAL_OBRIGATORIA: 'A senha atual é obrigatória',
  SENHA_NOVA_OBRIGATORIA: 'A nova senha é obrigatória',
  SENHA_CONFIRMACAO_OBRIGATORIA: 'A confirmação de senha é obrigatória',

  // CPF/CNPJ
  CPF_INVALIDO: 'O CPF informado é inválido',
  CPF_OBRIGATORIO: 'O CPF é obrigatório',
  CNPJ_INVALIDO: 'O CNPJ informado é inválido',
  CNPJ_OBRIGATORIO: 'O CNPJ é obrigatório',

  // CEP
  CEP_INVALIDO: 'O CEP informado é inválido (formato: 00000-000)',
  CEP_OBRIGATORIO: 'O CEP é obrigatório',

  // Telefone
  TELEFONE_INVALIDO:
    'O telefone informado é inválido (formato: (00) 00000-0000 ou (00) 0000-0000)',
  TELEFONE_OBRIGATORIO: 'O telefone é obrigatório',

  // Data
  DATA_INVALIDA: 'A data informada é inválida (formato: YYYY-MM-DD)',
  DATA_OBRIGATORIA: 'A data é obrigatória',
  DATA_NASCIMENTO_INVALIDA: 'A data de nascimento é inválida',
  DATA_FUTURA: 'A data não pode ser futura',
  DATA_PASSADA: 'A data não pode ser passada',

  // String
  STRING_VAZIA: (campo: string) => `O campo ${campo} não pode estar vazio`,
  STRING_MUITO_CURTA: (campo: string, min: number) =>
    `O campo ${campo} deve ter no mínimo ${min} caracteres`,
  STRING_MUITO_LONGA: (campo: string, max: number) =>
    `O campo ${campo} deve ter no máximo ${max} caracteres`,
  STRING_TAMANHO_EXATO: (campo: string, tamanho: number) =>
    `O campo ${campo} deve ter exatamente ${tamanho} caracteres`,

  // Número
  NUMERO_INVALIDO: (campo: string) => `O campo ${campo} deve ser um número`,
  NUMERO_MINIMO: (campo: string, min: number) =>
    `O campo ${campo} deve ser no mínimo ${min}`,
  NUMERO_MAXIMO: (campo: string, max: number) =>
    `O campo ${campo} deve ser no máximo ${max}`,
  NUMERO_POSITIVO: (campo: string) =>
    `O campo ${campo} deve ser um número positivo`,

  // Boolean
  BOOLEAN_INVALIDO: (campo: string) =>
    `O campo ${campo} deve ser verdadeiro ou falso`,

  // URL
  URL_INVALIDA: 'A URL informada é inválida',

  // Enum
  VALOR_INVALIDO: (campo: string, valores: string[]) =>
    `O campo ${campo} deve ser um dos seguintes valores: ${valores.join(', ')}`,

  // Array
  ARRAY_VAZIO: (campo: string) => `O campo ${campo} não pode estar vazio`,
  ARRAY_MINIMO: (campo: string, min: number) =>
    `O campo ${campo} deve ter no mínimo ${min} itens`,
  ARRAY_MAXIMO: (campo: string, max: number) =>
    `O campo ${campo} deve ter no máximo ${max} itens`,

  // Relacionamentos
  ID_INVALIDO: (entidade: string) => `O ID de ${entidade} é inválido`,
  ENTIDADE_NAO_ENCONTRADA: (entidade: string) =>
    `${entidade} não encontrado(a)`,

  // Duplicados
  REGISTRO_DUPLICADO: (campo: string) =>
    `Já existe um registro com este ${campo}`,
  EMAIL_JA_CADASTRADO: 'Este e-mail já está cadastrado',
  CPF_JA_CADASTRADO: 'Este CPF já está cadastrado',
  CNPJ_JA_CADASTRADO: 'Este CNPJ já está cadastrado',

  // Upload
  ARQUIVO_OBRIGATORIO: 'O arquivo é obrigatório',
  ARQUIVO_MUITO_GRANDE: (maxMB: number) =>
    `O arquivo deve ter no máximo ${maxMB}MB`,
  TIPO_ARQUIVO_INVALIDO: (tipos: string[]) =>
    `O arquivo deve ser do tipo: ${tipos.join(', ')}`,
};
