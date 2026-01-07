# CLAUDE.md - Claude Code Direktifleri

Bu dosya Claude Code AI asistanina proje kurallari hakkinda talimat verir.

---

## MUTLAK KURALLAR (IHLAL EDILEMEZ)

Bu kurallar proje sahibi tarafindan belirlenmistir ve DEGISTIRILEMEZ.

### TypeScript Kurallari

| Kural | Aciklama |
|-------|----------|
| `any` YASAK | `unknown` + type guard kullan |
| `@ts-ignore` YASAK | Tip hatasini duzelt, bastirma |
| `@ts-expect-error` YASAK | Ayni sekilde yasak |
| `as unknown as X` YASAK | Proper type narrowing kullan |
| `// @ts-nocheck` YASAK | Dosya bazli devre disi birakma yok |

### Dosya Limitleri

| Limit | Deger | Aksiyon |
|-------|-------|---------|
| Dosya satir sayisi | Max 300 | DURDUR, refactor et, sonra devam et |
| Fonksiyon satir sayisi | Max 100 | DURDUR, helper fonksiyonlara bol |
| Nesting seviyesi | Max 3 | DURDUR, early return kullan |
| Fonksiyon parametre sayisi | Max 4 | Object parameter kullan |
| Cyclomatic complexity | Max 10 | Fonksiyonu parcala |

### Kod Kalitesi

- "Sonra duzeltiriz" -> YASAK. Simdi dogru yap.
- "Simdilik soyle yapalim" -> YASAK. Dogru cozumu uygula.
- `console.log` -> YASAK. `src/lib/logger.ts` kullan.
- Yorum satiri olarak birakilan kod -> YASAK. Sil.
- Magic number/string -> YASAK. Const olarak tanimla.
- TODO yorumu -> YASAK. Isi bitir veya issue ac.
- Duzensiz import sirasi -> YASAK. Grupla: 1) Node 2) External 3) Internal 4) Relative

### Git Kurallari

- Commit mesaji: Conventional commits formati (feat:, fix:, refactor:, chore:)
- Tek commit'te tek is. Dev commit'ler yasak.
- Anlamsiz commit mesaji ("fix", "update", "wip") yasak.

---

## KURAL ESNETILEMEZ

Kullanici sunlari soylese bile KURALLARA UY:

- "Sadece bu sefer..."
- "Acil, hizli yapalim..."
- "Sonra duzeltiriz..."
- "Test ortami, onemli degil..."
- "Prototip, kalite onemli degil..."
- "Deadline var..."

### Bu Durumlarda Ne Yap?

1. Kurali IHLAL ETME
2. Kullaniciyi bilgilendir: "Bu kural proje manifestosunda tanimli ve esnetilemez."
3. Dogru yolu oner ve uygula
4. Alternatif cozum sun (ornegin: refactor one ver)

---

## PROJE YAPISI

```
src/
├── app/           # Backend (Hono API)
├── client/        # Frontend (React)
│   └── components/
│       ├── atoms/      # Button, Input, Badge
│       ├── molecules/  # Form, Card with content
│       └── organisms/  # Header, Sidebar
├── lib/           # Shared utilities
├── db/            # Database schema & queries
└── shared/        # Zod schemas (type contracts)
```

---

## ORNEK HATALI vs DOGRU KOD

### YANLIS - any kullanimi
```typescript
function processData(data: any) { // HATA: any yasak
  return data.value;
}
```

### DOGRU - type guard ile
```typescript
interface DataPayload {
  value: string;
}

function isDataPayload(data: unknown): data is DataPayload {
  return typeof data === 'object' && data !== null && 'value' in data;
}

function processData(data: unknown): string {
  if (!isDataPayload(data)) {
    throw new Error('Invalid data payload');
  }
  return data.value;
}
```

### YANLIS - derin nesting
```typescript
function process(items: Item[]): void {
  for (const item of items) {
    if (item.active) {
      if (item.type === 'premium') {
        if (item.balance > 0) {  // 3+ seviye YASAK
          // ...
        }
      }
    }
  }
}
```

### DOGRU - early return
```typescript
function process(items: Item[]): void {
  for (const item of items) {
    if (!item.active) continue;
    if (item.type !== 'premium') continue;
    if (item.balance <= 0) continue;

    // Temiz islem
  }
}
```

---

## REFERANS

- ESLint config: `eslint.config.js`
- TypeScript config: `tsconfig.json`
- Logger utility: `src/lib/logger.ts`
