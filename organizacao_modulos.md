# Organização dos Módulos - ERPLab

Mapeamento simplificado por módulo e páginas.

---

## 1. AUTENTICAÇÃO

- **chunk_001** (p1-20): Login (p5-6), Recuperar senha (p14, p20)
- **chunk_002** (p21-40): Fluxo completo recuperação senha (p21-26)

---

## 2. ATENDIMENTO

- **chunk_001** (p1-20): Fila (p7, p15), Pacientes (p8, p16-19)

---

## 3. PACIENTES

- **chunk_001** (p1-20): Cadastro (p12, p18-19), Visualizar (p13, p16-17, p19)
- **chunk_002** (p21-40): Exemplo preenchido (p27)

---

## 4. ADMINISTRATIVO - CONTABILIDADE

- **chunk_002** (p21-40): Contas a pagar (p29, p33-36, p40)
- **chunk_003** (p41-60): Pagar contas (p41-43, p59), Replicar conta (p55, p57-58, p60)
- **chunk_004** (p61-80): Exemplos completos (p61-62, p65-66), Repasse (p75-77)
- **chunk_006** (p101-120): Gerar NF (p103), Recursos glosa (p104), Faturas empresas (p107-111), Gerar fatura (p108-109), Faturas particular (p113-115), Gerar boleto (p116-118)
- **chunk_007** (p121-140): Visualizar NF (p121), Gerar recurso glosa (p122, p130-132, p135), Gerar relatório (p123-125), Dar baixa recebimento (p126-127, p136-137), Visualizar fatura (p128, p133, p138), Visualizar boleto (p134), Conciliação bancária (p140)
- **chunk_008** (p141-160): Conciliação bancária (p141-160), Gerar conciliação (p142-146), Visualizar conciliações (p147-148), Processo conciliação (p149-160), Detalhes lote (p154), Conciliação adquirente (p160)
- **chunk_009** (p161-180): Conciliação adquirente (p161-164), Gerar extrato (p165), Visualizar extrato (p166-167, p177), Detalhes fechamento (p168, p170-173), Fechamento caixa (p169), Extrato (p174-176), Fluxo de caixa (p178-180)
- **chunk_010** (p181-200): Enviar fluxo caixa (p181), DRE (p182-188), Gerar DRE (p184-186), Visualizar DRE (p187-188)

---

## 5. ADMINISTRATIVO - ESTOQUE/COMPRAS

- **chunk_002** (p21-40): Cadastro produto (p30, p37-39)
- **chunk_003** (p41-60): Gestão produtos (p44-53), Cotações (p54)
- **chunk_004** (p61-80): Histórico (p64), Solicitações (p67-68), Cotações completo (p69-70, p78-80), Dar baixa (p72-73)
- **chunk_005** (p81-100): Cotações (p81-82), Conferir NFE (p83, p94-95), Pendência entrega (p84, p86-87)
- **chunk_006** (p101-120): Compras (p101-102)

---

## 6. CONFIGURAÇÕES

- **chunk_001** (p1-20): Cadastros gerais, GED, Gerenciar Aulas
- **chunk_010** (p181-200): Menu configurações (p189-198), Cadastros gerais (p195), GED (p196), Gerenciar aulas (p197), Cadastros principais (p198-200), Unidades saúde (p199), Exames (p200)
- **chunk_011** (p201-220): Matrizes exames (p201, p213-217), Profissionais (p202, p218-220), Usuários (p203), Outras pendências (p204-205), Unidades saúde (p206-209), Exames (p210-212), Vincular assinatura (p220)
- **chunk_012** (p221-240): Visualizar profissionais (p221), Usuários (p222-224), Cadastros gerais (p225-227), Gerenciar aulas (p228-230), Cadastrar/visualizar tutorial (p229-231), Estrutura (p232), Cadastrar/visualizar unidade (p233-235)
- **chunk_013** (p241-260): Matrizes exames (p241, p245-247, p253-254, p258), Vincular certificado (p242), Exames (p243-244, p252), Cadastrar profissionais (p248-250, p255-256), Financeiro (p251), Documentação (p257), Usuários (p260)
- **chunk_014** (p261-280): Usuários (p261-266), Cadastrar/visualizar usuários (p261-264, p267-269), Perfis e permissões (p265), Histórico (p266), Outros (p270), Unidades (p271), Vincular certificado (p272-274), Exames (p275), Matrizes (p276-278), Profissionais (p279-280)
- **chunk_015** (p281-300): Perfis e permissões detalhados (p281-282), Editar tutorial (p283), Visualizar matrizes (p284-286, p294), Matrizes: Audiometria (p287), Densitometria (p289), Eletrocardiograma (p290), Hemograma (p296), Cadastrar agenda (p288), Cadastrar profissionais (p291-292), Editar unidade (p293, p295), Agendas/Métodos/Amostras/Kits (p297-300)
- **chunk_016** (p301-320): Agendas (p301-303, p314-317), Métodos (p304-306, p320), Amostras (p307-309), Kits (p310-313), Cadastrar agenda completo (p315-317), Notificações integração (p317), Visualização (p318), Ativar/Desativar (p319)
- **chunk_017** (p321-340): Cadastrar métodos (p321, p333), Visualizar método PCR (p322), Amostras listagem (p323), Cadastrar amostras (p324, p326), Kits listagem (p327), Cadastrar kits (p328-329, p334-335), Visualizar kit (p330), Agendas preenchido (p331-332), Empresas (p336-340), Empresas-Convênios (p338, p340), Cadastrar empresas (p339)
- **chunk_018** (p341-360): Empresas: Laboratórios apoio (p341-343), Telemedicina (p344-346), Fornecedores (p347-348), Prestadores serviço (p349-350), Listagem convênios (p351), Ativar/Desativar (p352, p360), Cadastrar empresa geral (p353), Cadastrar convênios (p354-359), Abas: Informações específicas (p355), Integração (p356), Restrições (p357), Planos (p358), Instruções (p359)
- **chunk_019** (p361-380): Cadastrar laboratório apoio (p361, p375-376), Ativar/Desativar (p362, p364, p366), Cadastrar telemedicina (p363, p378-379), Cadastrar fornecedores (p365), Cadastrar prestadores (p367), Integrações URLs (p368), Convênios atendimento (p369), Restrições/Planos/Instruções (p370-372), Informações específicas convênios (p373, p380), Listagens: Lab apoio (p374), Telemedicina (p377)
- **chunk_020** (p381-400): Telemedicina: Dados cadastro (p381), Vincular exames (p382-383), Fornecedores/Prestadores listagem (p384, p389), Cadastrar fornecedores (p385), Cadastrar prestadores (p386), Integrações TISS (p387), Fornecedores: Dados insumos (p388), Lab apoio preenchido (p390-391, p394-396), Prestadores: Dados serviços (p392), Atendimento: Campos obrigatórios (p393), Tabela preços (p397-399), Opções (p400)
- **chunk_021** (p401-420): Cadastrar tabela preços (p401, p404), Vincular exames lab apoio (p402-403), Informações específicas lab apoio (p405), Informações empresas gerais (p406), Estrutura (p407-416), Salas/Setores (p408, p411, p414), Equipamentos/Imobilizados (p409, p412, p415), Etiquetas amostra (p410, p413, p416), Documentação (p417-420), Cabeçalhos/Rodapés (p418, p420), Formulários atendimento (p419)
- **chunk_022** (p421-440): Formulários atendimento (p421, p423), Cabeçalhos/Rodapés (p422), Financeiro (p424-440), Bancos (p424, p428-430, p437-439), Adquirentes (p425, p431-433), Hierarquia CFO (p426, p434-436), Cadastrar bancos (p438-439), Observações (p440)
- **chunk_023** (p441-460): Adquirentes listagem (p441-442), Cadastrar adquirentes (p443-444), Integração bancos (p446), Hierarquia CFO (p447-449, p452), Cadastrar bancos preenchido (p450), Cadastrar adquirentes preenchido (p451), Outros (p453-460), Importação tabelas (p454, p457), Integrações (p455, p458-459), Campos formulário (p456, p460)
- **chunk_024** (p461-480): Campos formulário (p461-462, p469-474), Importação tabelas (p463), Integrações (p464-468, p473), Cadastrar campos formulário (p461, p471, p474), Visualizar campos (p462, p472), Integrações listagem (p464-465), Cadastrar integração (p466-467), Observações (p468), Dados (p475-480), Dashboard (p476), Relatórios (p477), Auditorias (p478), Menu (p479-480)

---

## 7. DADOS

- **chunk_001** (p1-20): Dashboard, Relatórios, Auditorias
- **chunk_024** (p461-480): Dashboard (p476), Relatórios (p477), Auditorias (p478), Menu (p479-480)
- **chunk_025** (p481-500): Dashboard completo (p481), Relatórios (p482-484), Auditorias (p485)

---

## 8. TUTORIAIS

- **chunk_001** (p1-20): Vídeos tutoriais
- **chunk_025** (p481-500): Tela tutoriais (p486, p492-493), Vídeos categorias (p492), FAQ (p492), Detalhes vídeo (p493)

---

## 9. NOTIFICAÇÕES

- **chunk_001** (p1-20): Central de notificações
- **chunk_025** (p481-500): Tela notificações (p487)

---

## 10. SUPORTE

- **chunk_001** (p1-20): Chat, WhatsApp, FAQ
- **chunk_025** (p481-500): Tela suporte (p488)

---

## 11. PERFIL/USUÁRIO

- **chunk_025** (p481-500): Perfil completo (p494, p498), Editar usuário (p495, p499), Alterar senha (p496, p500)
- **chunk_026** (p501): Alterar senha preenchido (p501)

---

## 12. INTERFACE/NAVEGAÇÃO

- **chunk_025** (p481-500): Tela principal (p489-491), Nova tela (p489, p495-496), Pronto para desenvolver (p490-491)

---
