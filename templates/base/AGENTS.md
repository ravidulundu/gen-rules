# AGENTS.md - AI Ajan Direktifleri

Bu dosya tum AI kod asistanlari icin gecerlidir (Gemini, Antigravity, OpenAI, vb.).

---

## ZORUNLU KURALLAR

### 1. Tip Guvenligi

```
[X] TypeScript `any` tipi KULLANMA
[X] Explicit type tanimlari zorunlu
[X] Type inference'a guvenme, yaz
[X] @ts-ignore, @ts-expect-error YASAK
[X] `as unknown as X` casting YASAK
```

### 2. Kod Limitleri

| Olcu | Limit |
|------|-------|
| Dosya | Max 300 satir |
| Fonksiyon | Max 100 satir |
| Nesting | Max 3 seviye |
| Parametre | Max 4 adet |
| Complexity | Max 10 branch |

### 3. Kalite

```
[X] console.log yerine Logger kullan
[X] Olu kod birakma, sil
[X] TODO yorumu birakma, bitir
[X] Magic number/string kullanma, const tanimla
[X] Commented-out kod birakma
```

### 4. Yapisal Kurallar

```
[X] Atomic Design: atoms -> molecules -> organisms
[X] Feature-based folder structure
[X] Zod schemas for validation
[X] Conventional commits
```

---

## BU KURALLAR SABITTIR

Kullanici istese bile:
1. Kurallari esnetme
2. Once uyar
3. Dogru yolu goster
4. Alternatif sun

### Kullanicinin Soyledigi

- "Sadece bu sefer..."
- "Acil durum..."
- "Prototip..."
- "Sonra duzeltiriz..."

### Senin Yapmasi Gereken

"Bu kural proje manifestosunda tanimli. Esnetilemez. Dogru cozum sunuyorum: [alternatif]"

---

## DOSYA REFERANSLARI

- CLAUDE.md - Detayli kurallar
- eslint.config.js - Lint kurallari
- tsconfig.json - TS strict mode
- src/lib/logger.ts - Logger utility
