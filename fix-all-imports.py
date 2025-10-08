#!/usr/bin/env python3
"""
Script para corrigir TODOS os imports após reorganização de módulos
"""
import os
import re
import subprocess

# Mapeamento de módulos antigos para novos
MAPPINGS = {
    # Dentro dos próprios módulos (imports relativos)
    # Autenticação
    (r"from ['\"]\.\./(email|auditoria)/", r"from '../../../infraestrutura/\1/"),
    (r"from ['\"]\.\./(unidade-saude)/", r"from '../../../cadastros/\1/"),

    # Cadastros
    (r"from ['\"]\.\./(auth)/", r"from '../../../autenticacao/\1/"),
    (r"from ['\"]\.\./(comum)/", r"from '../../../infraestrutura/common/"),

    # Exames (precisa ajustar paths relativos entre submodulos)
    (r"from ['\"]\.\./(exames)/entities", r"from '../\1/entities"),
    (r"from ['\"]\.\./(convenios)/", r"from '../../../relacionamento/\1/"),

    # Relacionamento
    (r"from ['\"]\.\./(empresas)/", r"from '../../../cadastros/\1/"),

    # Atendimento
    (r"from ['\"]\.\./\.\./auth/", r"from '../../../autenticacao/auth/"),
    (r"from ['\"]\.\./(unidade-saude|profissionais|pacientes)/", r"from '../../../cadastros/\1/"),

    # Geral - corrigir depth de ../
    (r"from ['\"]\.\./(agendas|integracoes|atendimento)/", r"from '../\1/"),
}

def fix_imports_in_file(filepath):
    """Corrige imports em um arquivo específico"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Aplicar todas as substituições
        for pattern, replacement in MAPPINGS:
            content = re.sub(pattern, replacement, content)

        # Salvar apenas se mudou
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
    except Exception as e:
        print(f"Erro ao processar {filepath}: {e}")

    return False

def main():
    print("🔧 Corrigindo imports automaticamente...")

    changed = 0
    total = 0

    # Percorrer todos os arquivos .ts
    for root, dirs, files in os.walk('src/modules'):
        for file in files:
            if file.endswith('.ts'):
                total += 1
                filepath = os.path.join(root, file)
                if fix_imports_in_file(filepath):
                    changed += 1
                    print(f"  ✓ {filepath}")

    print(f"\n✅ {changed}/{total} arquivos modificados")
    print("🔨 Execute 'npm run build' para verificar")

if __name__ == '__main__':
    main()
