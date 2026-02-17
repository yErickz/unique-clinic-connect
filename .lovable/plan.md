
# Preview da Galeria no Admin

## Objetivo
Adicionar uma preview visual no editor da galeria que mostra exatamente como os cards vao ficar no site publico, usando o mesmo grid de 3 colunas com os spans corretos (normal, wide, vertical).

## O que muda

### GalleryEditor.tsx
- Adicionar um botao toggle "Visualizar" (icone Eye/EyeOff) no topo do editor
- Quando ativado, renderizar abaixo da lista de itens um mini-grid que replica o layout do `ClinicGallerySection`:
  - Grid de 3 colunas com `auto-rows-[180px]` (um pouco menor que o publico)
  - Cada card mostra a foto com overlay + label/descricao, ou o fallback com icone caso nao tenha foto
  - Classes de span identicas: `col-span-2` para wide, `row-span-2` para vertical
  - Borda tracejada ao redor para indicar que e uma preview
- O preview atualiza em tempo real conforme o usuario edita nome, descricao, foto ou span

### Detalhes tecnicos
- Reutilizar os mesmos gradientes e estilos do `ClinicGallerySection` para fidelidade visual
- Nenhuma mudanca no backend ou banco de dados
- Componente de preview sera inline dentro do `GalleryEditor`, sem modais
- Estado controlado por um `useState<boolean>` simples (`showPreview`)
