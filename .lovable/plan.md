

# Reestruturacao Completa — Renda Visivel

## Resumo das Mudancas

Rebranding completo de "MaskID" para "Renda Visivel", nova paleta branco e rosa (cores solidas, sem gradientes), nova logo, nova secao de video, reorganizacao da ordem das secoes e remocao de cards especificos.

---

## 1. Paleta de Cores (Branco e Rosa, sem gradientes)

**Arquivo:** `src/index.css`

- Remover as variaveis `--gradient-hero` e `--gradient-cta` (gradientes)
- Ajustar `--primary` para rosa solido (322 80% 50%) em vez de azul
- Manter `--secondary` rosa ou ajustar para branco como cor de apoio
- Simplificar para duas cores dominantes: branco (#FFFFFF) e rosa (hsl 322 80% 50%)
- Atualizar `--maskid-deep` e demais tokens customizados

**Arquivo:** `tailwind.config.ts`
- Atualizar referencias de cores se necessario

**Impacto em todos os componentes:** Substituir classes `bg-gradient-hero`, `bg-gradient-cta`, `text-gradient` por cores solidas rosa ou branco.

---

## 2. Renomear MaskID para Renda Visivel (global)

Substituicao em todos os arquivos que mencionam "MaskID" ou "Mask":

- **Header.tsx**: Ja esta "Renda Visivel" (feito anteriormente)
- **HeroSection.tsx** (linha 62): "A MaskID esta mudando isso" -> "A Renda Visivel esta mudando isso"
- **SolutionSection.tsx** (linha 67): "A MaskID conecta..." -> "A Renda Visivel conecta..."
- **SocialProofSection.tsx** (linhas 7-9): Depoimentos mencionando "MaskID" -> "Renda Visivel"
- **QuizSection.tsx** (linhas 63, 67, 73): "MaskID" -> "Renda Visivel"
- **EducationSection.tsx** (linhas 116, 124): "MaskID Assistente" e "assistente da MaskID" -> "Renda Visivel"
- **Footer.tsx** (linhas 11, 13-14, 46, 67): Logo "M" -> icone relevante, "MaskID" -> "Renda Visivel", email -> contato@rendavisivel.com.br
- **CTASection.tsx**: Sem mencoes diretas a MaskID, mas atualizar gradientes

---

## 3. Nova Logo

Substituir o icone "M" em circulo por algo que represente "Renda Visivel":
- Usar um icone Lucide como `Eye` ou `TrendingUp` dentro do circulo
- Fundo rosa solido em vez de gradiente
- Aplicar no **Header.tsx** e **Footer.tsx**

---

## 4. Nova Secao: Video ("Entenda o Programa")

**Novo componente:** `src/components/landing/VideoSection.tsx`

- Secao com id `#video` para ancoragem
- Placeholder de video (retangulo 16:9 com icone de play, mensagem "Video em breve")
- Titulo: "Entenda o Programa"
- Subtitulo explicativo
- Posicionada entre EducationSection e CTASection na ordem final

---

## 5. Hero Section — Dois Botoes

**Arquivo:** `src/components/landing/HeroSection.tsx`

- Adicionar segundo botao "Entenda o programa" ao lado de "Quero participar"
- Ancora do "Entenda o programa" aponta para `#video`
- Estilo do segundo botao: outline/ghost com borda branca para diferenciar do CTA principal

---

## 6. Botao Login no Header — Destaque diferenciado

**Arquivo:** `src/components/landing/Header.tsx`

- Botao Login: borda branca ou outline claro (diferente do fundo mas diferente do botao Cadastro)
- Botao Cadastro: fundo rosa solido
- Garantir contraste visual entre os dois

---

## 7. SolutionSection — Remover cards PIX e Comunidade

**Arquivo:** `src/components/landing/SolutionSection.tsx`

- Remover o card "Integracao PIX" (indice 3)
- Remover o card "Comunidade" (indice 9)
- Manter os 8 cards restantes

---

## 8. Ordem Final das Secoes

**Arquivo:** `src/pages/Index.tsx`

```text
1. Header (fixo)
2. HeroSection (com 2 botoes)
3. DataProofSection (big numbers - mantida)
4. PainSection ("O Problema" com cards - mantida)
5. SolutionSection (flip cards, sem PIX e Comunidade)
6. QuizSection (mantida)
7. SocialProofSection (mantida)
8. EducationSection (mantida)
9. VideoSection (NOVA - placeholder de video)
10. CTASection (formulario - mantida)
11. Footer
```

---

## Detalhes Tecnicos

### Arquivos modificados:
1. `src/index.css` — Paleta sem gradientes, cores solidas
2. `src/components/landing/Header.tsx` — Logo, botoes Login/Cadastro
3. `src/components/landing/HeroSection.tsx` — 2 botoes, remover gradientes, renomear
4. `src/components/landing/DataProofSection.tsx` — Remover gradientes
5. `src/components/landing/PainSection.tsx` — Remover gradientes, cores solidas
6. `src/components/landing/SolutionSection.tsx` — Remover 2 cards, remover gradientes, renomear
7. `src/components/landing/QuizSection.tsx` — Renomear, remover gradientes
8. `src/components/landing/SocialProofSection.tsx` — Renomear, remover gradientes
9. `src/components/landing/EducationSection.tsx` — Renomear chatbot, remover gradientes
10. `src/components/landing/CTASection.tsx` — Remover gradientes, cores solidas
11. `src/components/landing/Footer.tsx` — Logo, renomear, email
12. `src/pages/Index.tsx` — Adicionar VideoSection na ordem correta

### Arquivo novo:
13. `src/components/landing/VideoSection.tsx` — Placeholder de video

