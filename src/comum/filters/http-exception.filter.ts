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
        // Traduz mensagens padrão do ValidationPipe
        const mensagemTraduzida = this.traduzirMensagemPadrao(erro);
        errosFormatados.push(mensagemTraduzida);
      } else if (erro.constraints) {
        // Extrai todas as mensagens de erro do campo
        Object.values(erro.constraints).forEach((mensagem) => {
          const mensagemTraduzida = this.traduzirMensagemPadrao(
            mensagem as string,
          );
          errosFormatados.push(mensagemTraduzida);
        });
      }
    });

    return errosFormatados;
  }

  private traduzirMensagemPadrao(mensagem: string): string {
    // Mapeamento de mensagens comuns do class-validator para português
    const traducoes: { [key: string]: string } = {
      // Erros de propriedades não permitidas (whitelist)
      'property .+ should not exist': 'Propriedade não permitida: {campo}',

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

      // Erros de tamanho
      'must be longer than or equal to': 'deve ter no mínimo {min} caracteres',
      'must be shorter than or equal to': 'deve ter no máximo {max} caracteres',
      'must contain at least': 'deve conter no mínimo {min} itens',
      'must contain no more than': 'deve conter no máximo {max} itens',

      // Erros de valores
      'should not be empty': 'não pode estar vazio',
      'must be positive': 'deve ser um número positivo',
      'must be negative': 'deve ser um número negativo',

      // Erros de enum
      'must be one of the following values':
        'deve ser um dos seguintes valores',
    };

    // Tenta encontrar uma tradução para a mensagem
    for (const [padrao, traducao] of Object.entries(traducoes)) {
      const regex = new RegExp(padrao, 'i');
      if (regex.test(mensagem)) {
        // Extrai o nome do campo da mensagem original
        const campoMatch = mensagem.match(/property (\w+)/);
        if (campoMatch) {
          const campo = campoMatch[1];
          return traducao.replace('{campo}', campo);
        }
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
