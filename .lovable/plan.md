
# Substituir editor JSON de Exames por interface visual

## O que muda

Atualmente, a seção "Exames" abre um campo de texto com JSON puro para editar a lista. Isso e confuso e propenso a erros. A ideia e substituir esse campo por uma interface amigavel onde voce pode:

- Ver cada exame como um item individual (nome + preco)
- Remover qualquer exame com um botao de lixeira
- Adicionar novos exames preenchendo nome e preco em campos separados
- Tudo dentro do mesmo modal de edicao, sem precisar mexer em JSON

## Como vai funcionar

Quando o modal da secao "Exames" abrir, ao inves do campo de texto com JSON, voce vera:

1. **Titulo** -- campo de texto normal (ja existe)
2. **Lista de exames** -- cada exame aparece como uma linha com:
   - Campo "Nome" (ex: Hemograma)
   - Campo "Preco" (ex: R$ 45,00)
   - Botao vermelho de lixeira para remover
3. **Botao "+ Adicionar Exame"** na parte de baixo para inserir um novo item
4. Ao salvar, a lista e convertida de volta para JSON automaticamente

## Detalhes tecnicos

**Arquivo modificado:** `src/pages/admin/AdminContent.tsx`

- Detectar quando a key sendo renderizada e `exams_data`
- Em vez de renderizar um `Textarea`, renderizar um componente customizado inline que:
  - Faz `JSON.parse` do valor atual do draft para obter o array `{name, price}[]`
  - Renderiza cada item como uma linha com dois `Input` e um botao `Trash2`
  - Botao "Adicionar Exame" faz push de `{name: "", price: ""}` no array
  - Cada mudanca faz `JSON.stringify` do array atualizado e grava de volta no `drafts["exams_data"]`
- O fluxo de salvamento continua o mesmo (o valor final e uma string JSON valida)
- Nenhuma mudanca no banco de dados e necessaria
