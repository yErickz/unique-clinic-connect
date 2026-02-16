

## Corrigir Preview do Link (Open Graph)

### Problema
Quando o link e compartilhado, aparece:
- **Titulo**: "Cinica Unique" (faltando o "l" - erro de digitacao)
- **Descricao**: "MvP do site da Unique" (texto interno, nao profissional)
- **Imagem**: screenshot generico do Lovable

### Correcoes no `index.html`

1. **Titulo**: Alterar de "Cinica Unique" para "Clinica Unique | Grupo Unique"
2. **Descricao**: Alterar de "MvP do site da Unique" para algo profissional como "Referencia em saude em Tucuma. Cardiologia, Ortopedia, Dermatologia, Oftalmologia e mais. Agende sua consulta."
3. **Atualizar todas as meta tags** (title, og:title, twitter:title, description, og:description, twitter:description)

### Detalhe Tecnico

Arquivo: `index.html`
- Linha 7: `<title>` - corrigir typo e melhorar texto
- Linha 8: `<meta name="description">` - texto profissional
- Linha 17: `<meta property="og:title">` - mesmo titulo corrigido
- Linha 18: `<meta name="twitter:title">` - mesmo titulo corrigido
- Linha 19: `<meta property="og:description">` - mesma descricao profissional
- Linha 20: `<meta name="twitter:description">` - mesma descricao profissional

**Nota**: A imagem de preview (og:image) continuara sendo o screenshot atual do Lovable. Para uma imagem personalizada, seria necessario criar/hospedar uma imagem de banner propria (1200x630px).

