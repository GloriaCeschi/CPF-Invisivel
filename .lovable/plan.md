

# Alterações no Header - "Renda Visível"

Vou fazer 3 mudanças visuais no componente Header:

## 1. Nome da Brand
**Antes**: "Mask" (texto padrão) + "ID" (rosa)
**Depois**: "Renda" (branco) + "Visível" (rosa)

Mudança na linha 48-50:
- Remover classes `text-foreground` do span pai
- Adicionar `text-white` ao "Renda"
- Manter `text-secondary` (rosa) no "Visível"

## 2. Menu Desktop (Desktop Nav)
**Antes**: Links cinzentos (`text-muted-foreground`) com hover para cor padrão
**Depois**: Links brancos com hover para cinza escuro para manter contraste

Mudança na linha 59:
- Mudar `text-muted-foreground` para `text-white`
- Mudar `hover:text-foreground` para `hover:text-slate-700` (cinza escuro)

## 3. Menu Mobile
**Antes**: Links cinzentos com hover padrão
**Depois**: Links brancos com hover para cinza escuro (mesmo padrão do desktop)

Mudança na linha 97:
- Mudar `text-muted-foreground` para `text-white`
- Mudar `hover:text-foreground` para `hover:text-slate-700`

### Resultado Final
- Logo será "Renda" (branco) + "Visível" (rosa/magenta)
- Todos os links de navegação serão brancos
- No hover, ficam cinza escuro para manter legibilidade contra fundo claro

