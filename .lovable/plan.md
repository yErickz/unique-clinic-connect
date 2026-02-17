
## Categoria como Select/Dropdown

Substituir o campo de texto livre da categoria por um componente Select (dropdown) que lista as categorias ja existentes, com opcao de criar uma nova categoria.

### O que muda

**Arquivo:** `src/components/admin/ExamsEditor.tsx`

1. Importar os componentes `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` de `@/components/ui/select`
2. Adicionar estado local `newCategory` para controlar a criacao de nova categoria via Input inline
3. Substituir o `Input` + `datalist` da categoria por um `Select` dropdown com:
   - Um item para cada categoria existente (derivada dos exames atuais)
   - Um item especial "Nova categoria..." que ao ser selecionado exibe um Input para digitar o nome da nova categoria
   - Um item "Sem categoria" para limpar a selecao
4. Quando o usuario seleciona "Nova categoria...", aparece um Input inline para digitar e confirmar a nova categoria
5. Manter os chips de categorias no topo do editor (ja existentes)

### Detalhes tecnicos

- O dropdown usa os componentes shadcn/ui Select ja disponiveis no projeto
- As categorias sao derivadas dinamicamente dos exames (`[...new Set(exams.map(e => e.category).filter(Boolean))]`), sem necessidade de tabela separada
- Ao selecionar "nova_categoria" como valor especial, o estado `newCategory` e ativado mostrando um Input + botao confirmar
- O Select tera `z-50` e background solido via classes ja definidas no componente Select do projeto
