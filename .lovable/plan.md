

## Plano: Enriquecer o Site com Depoimentos e Galeria

### 1. Secao de Depoimentos de Pacientes

Adicionar uma nova secao na pagina inicial (entre Convenios e FAQ) com depoimentos de pacientes. O design tera:

- Cards com citacao, nome do paciente (iniciais para privacidade), especialidade consultada e avaliacao em estrelas
- Layout em grid responsivo (3 colunas desktop, 1 mobile)
- Animacoes de entrada consistentes com o resto do site
- Icone de aspas estilizado em cada card
- Dados ficticios iniciais que o proprietario podera substituir por depoimentos reais

Exemplo de depoimentos:
- "Atendimento excelente e muito humanizado. Me senti acolhida desde a recepcao." -- M.S., Cardiologia
- "Resultados dos exames rapidos e equipe muito atenciosa." -- J.P., Laboratorio
- "Medicos competentes e ambiente muito confortavel." -- A.L., Ortopedia

### 2. Secao Galeria de Fotos da Clinica

Adicionar uma secao visual na pagina inicial (antes do CTA final) mostrando o ambiente da clinica:

- Grid de fotos com efeito hover (zoom suave)
- Layout masonry-style ou grid uniforme com cantos arredondados
- Como nao temos fotos reais da clinica ainda, usaremos placeholders descritivos com icones indicando o tipo de ambiente (Recepcao, Consultorio, Laboratorio, Sala de Espera)
- O proprietario podera enviar fotos reais para substituir depois

### 3. Arquivos Modificados

- **src/pages/Index.tsx** -- Importar e posicionar os dois novos componentes
- **src/components/TestimonialsSection.tsx** -- Novo componente de depoimentos
- **src/components/ClinicGallerySection.tsx** -- Novo componente de galeria

### Ordem na pagina inicial (atualizada)

1. Hero
2. Sobre o Grupo Unique
3. Especialidades
4. Exames mais pesquisados
5. Convenios
6. **Depoimentos** (novo)
7. FAQ
8. **Galeria da Clinica** (novo)
9. CTA Final

