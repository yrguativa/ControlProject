# Manual de Marca — ControlProject

## Identidad

ControlProject es un sistema de votacion electronica para asambleas de propiedad horizontal en Colombia. La marca transmite confianza, precision tecnica y modernidad accesible.

## Colorimetria

### Paleta principal

| Nombre | HEX | RGB | Uso |
|--------|-----|-----|-----|
| Navy Profundo | `#0A1628` | 10, 22, 40 | Fondo principal, textos de alto contraste |
| Verde Voto | `#00E676` | 0, 230, 118 | Acento primario, CTAs, indicadores de exito |
| Ambar Energia | `#FFB300` | 255, 179, 0 | Acento secundario, highlights, badges |
| Blanco Hielo | `#F8FAFC` | 248, 250, 252 | Fondos claros, superficies |
| Gris Piedra | `#64748B` | 100, 116, 139 | Texto secundario, bordes |
| Gris Humo | `#E2E8F0` | 226, 232, 240 | Divisores, fondos de tarjetas |

### Paleta de soporte

| Nombre | HEX | Uso |
|--------|-----|-----|
| Rojo Votar No | `#EF4444` | Voto negativo, errores |
| Azul Confianza | `#3B82F6` | Links, info |
| Violeta Tech | `#8B5CF6` | Gradientos, acento terciario |

### Reglas de uso

- Navy Profundo se usa como fondo en hero y secciones oscuras
- Verde Voto es el color de accion principal (botones, iconos de éxito)
- Ambar Energia solo para highlights puntuales (nunca en bloques grandes)
- El contraste minimo entre texto y fondo debe ser 4.5:1 (WCAG AA)

## Tipografia

### Fuentes

| Familha | Peso | Uso | Google Fonts |
|---------|------|-----|-------------|
| Outfit | 700, 800, 900 | Titulares, hero, numeros grandes | `Outfit` |
| DM Sans | 400, 500, 600 | Body text, parrafos, UI | `DM Sans` |

### Escala tipografica

| Token | Tamaño | Line-height | Uso |
|-------|--------|-------------|-----|
| `--text-hero` | 4.5rem (72px) | 1.05 | Titular principal del hero |
| `--text-h1` | 3rem (48px) | 1.1 | Titulos de seccion |
| `--text-h2` | 2rem (32px) | 1.2 | Subtitulos |
| `--text-h3` | 1.5rem (24px) | 1.3 | Titulos de tarjeta |
| `--text-body` | 1.125rem (18px) | 1.6 | Parrafos |
| `--text-small` | 0.875rem (14px) | 1.5 | Captions, labels |
| `--text-mono` | 1rem (16px) | 1.5 | Codigos, datos tecnicos |

## Espaciado

Sistema de 8px base:

| Token | Valor |
|-------|-------|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |
| `--space-3xl` | 64px |
| `--space-4xl` | 96px |
| `--space-5xl` | 128px |

## Bordes y sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-sm` | 6px | Botones pequenos, inputs |
| `--radius-md` | 12px | Tarjetas |
| `--radius-lg` | 20px | Bloques grandes |
| `--radius-full` | 9999px | Badges, pills |
| `--shadow-card` | 0 4px 24px rgba(10,22,40,0.08) | Tarjetas elevadas |
| `--shadow-glow` | 0 0 40px rgba(0,230,118,0.15) | Efecto glow verde |

## Animaciones

| Tipo | Duracion | Easing | Uso |
|------|----------|--------|-----|
| Micro | 150ms | `ease-out` | Hover, focus states |
| Standard | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Transiciones de layout |
| Dramatic | 600ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Entradas de elementos |
| Stagger | 100ms delay | `cubic-bezier(0.16, 1, 0.3, 1)` | Secuencias de animacion |

## Iconografia

- Estilo: line icons, stroke 2px
- Tamano: 24px default
- Color: hereda del texto o usa Verde Voto
- Biblioteca sugerida: Lucide Icons (SVG inline)

## Logo concept

El logotipo combina un circulo (representando uniformidad/consenso) con un checkmark (representando el voto). Se usa en version completa (icono + texto) y compacta (solo icono).
