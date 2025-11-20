import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Se for erro de validação, formata as mensagens em português
    if (
      exception instanceof BadRequestException &&
      typeof exceptionResponse === 'object'
    ) {
      const responseObj = exceptionResponse as any;

      if (Array.isArray(responseObj.message)) {
        const errosFormatados = this.formatarErrosDeValidacao(
          responseObj.message,
        );

        return response.status(status).json({
          statusCode: status,
          mensagem: 'Erro de validação',
          erros: errosFormatados,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Para outros tipos de erro HTTP, retorna formato padrão
    const mensagem =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || 'Erro no servidor';

    response.status(status).json({
      statusCode: status,
      mensagem: Array.isArray(mensagem) ? mensagem[0] : mensagem,
      timestamp: new Date().toISOString(),
    });
  }

  private formatarErrosDeValidacao(erros: any[]): string[] {
    const errosFormatados: string[] = [];

    erros.forEach((erro) => {
      if (typeof erro === 'string') {
        // Formato: "campo must be..." ou "campo.subcampo should not..."
        // Extrair o nome do campo e a mensagem
        const match = erro.match(/^(.+?)\s+(must|should|has|is|contains)/);
        if (match) {
          const campo = match[1]; // Ex: "codigoServicoPrincipal" ou "contas_bancarias.0.numero_conta"
          const mensagem = erro.substring(campo.length + 1); // Ex: "must be longer than..."
          const mensagemTraduzida = this.traduzirMensagemPadrao(mensagem);
          errosFormatados.push(`${campo}: ${mensagemTraduzida}`);
        } else {
          // Se não conseguir extrair, usa a mensagem completa
          const mensagemTraduzida = this.traduzirMensagemPadrao(erro);
          errosFormatados.push(mensagemTraduzida);
        }
      } else if (erro.constraints) {
        // Extrai todas as mensagens de erro do campo
        const campo = erro.property; // Nome do campo que falhou
        Object.values(erro.constraints).forEach((mensagem) => {
          const mensagemTraduzida = this.traduzirMensagemPadrao(
            mensagem as string,
          );
          // Inclui o nome do campo na mensagem de erro
          errosFormatados.push(`${campo}: ${mensagemTraduzida}`);
        });
      } else if (erro.children && erro.children.length > 0) {
        // Erros aninhados (DTOs nested como contas_bancarias, horariosAtendimento)
        const campo = erro.property; // Nome do array pai (ex: contas_bancarias)
        const errosFilhos = this.formatarErrosDeValidacao(erro.children);
        errosFilhos.forEach((erroFilho) => {
          errosFormatados.push(`${campo}.${erroFilho}`);
        });
      }
    });

    return errosFormatados;
  }

  private traduzirMensagemPadrao(mensagem: string): string {
    // Erros de tamanho com valores numéricos
    let match = mensagem.match(
      /must be longer than or equal to (\d+) characters?/i,
    );
    if (match) {
      return `deve ter no mínimo ${match[1]} caracteres`;
    }

    match = mensagem.match(
      /must be shorter than or equal to (\d+) characters?/i,
    );
    if (match) {
      return `deve ter no máximo ${match[1]} caracteres`;
    }

    match = mensagem.match(/must contain at least (\d+) items?/i);
    if (match) {
      return `deve conter no mínimo ${match[1]} itens`;
    }

    match = mensagem.match(/must contain no more than (\d+) items?/i);
    if (match) {
      return `deve conter no máximo ${match[1]} itens`;
    }

    // Mapeamento de mensagens simples
    const traducoes: { [key: string]: string } = {
      // Erros de tipos
      'must be a string': 'deve ser um texto',
      'must be a number': 'deve ser um número',
      'must be a boolean': 'deve ser verdadeiro ou falso',
      'must be an array': 'deve ser uma lista',
      'must be an object': 'deve ser um objeto',

      // Erros de formato
      'must be an email': 'deve ser um e-mail válido',
      'must be a URL': 'deve ser uma URL válida',
      'must be a UUID': 'deve ser um UUID válido',
      'must be a date': 'deve ser uma data válida',

      // Erros de valores
      'should not be empty': 'não pode estar vazio',
      'must be positive': 'deve ser um número positivo',
      'must be negative': 'deve ser um número negativo',
      'must be one of the following values':
        'deve ser um dos seguintes valores',
    };

    // Tenta encontrar uma tradução exata
    for (const [padrao, traducao] of Object.entries(traducoes)) {
      if (mensagem.toLowerCase().includes(padrao.toLowerCase())) {
        return traducao;
      }
    }

    // Tradução específica para "property X should not exist"
    const propriedadeNaoPermitida = mensagem.match(
      /property (\w+) should not exist/i,
    );
    if (propriedadeNaoPermitida) {
      const campo = propriedadeNaoPermitida[1];
      return `O campo '${campo}' não é permitido`;
    }

    // Se não encontrou tradução, retorna a mensagem original
    return mensagem;
  }
}
