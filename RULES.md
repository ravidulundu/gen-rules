# gen-rules Manifesto

Bu belge, tüm projelerimde uygulanacak kod kalitesi standartlarını tanımlar.
Bu kurallar **değiştirilemez** ve **esnetilemez**.

---

## Felsefe

> "Good taste is the ability to identify and select solutions that are
> not only correct but also elegant, maintainable, and idiomatic."
> — Linus Torvalds

Bu manifesto, "good taste" prensibini kod kalitesine uygular.

---

## 1. Kod Limitleri

| Ölçü | Limit | Gerekçe |
|------|-------|---------|
| Dosya satır sayısı | Max 300 | Okunabilirlik ve bakım kolaylığı |
| Fonksiyon satır sayısı | Max 100 | Single responsibility principle |
| Nesting derinliği | Max 3 | Cognitive complexity azaltma |
| Parametre sayısı | Max 4 | Interface simplicity |
| Cyclomatic complexity | Max 10 | Test edilebilirlik |

### Limit Aşıldığında Ne Yapılır?

1. **DURDUR** - Kodu commit etme
2. **REFACTOR ET** - Kodu küçük parçalara böl
3. **DEVAM ET** - Limitler içinde çalış

---

## 2. TypeScript Kuralları

### Kesin Yasak

```typescript
// YANLIŞ - any kullanımı
function process(data: any) { }

// YANLIŞ - ts-ignore
// @ts-ignore
const value = unsafeOperation();

// YANLIŞ - unsafe casting
const user = data as unknown as User;
```

### Doğru Kullanım

```typescript
// DOĞRU - unknown + type guard
function isUser(data: unknown): data is User {
  return typeof data === 'object' && data !== null && 'id' in data;
}

function process(data: unknown): User {
  if (!isUser(data)) {
    throw new Error('Invalid user data');
  }
  return data;
}
```

---

## 3. Kod Kalitesi

### Yasak Pratikler

| Pratik | Neden Yasak |
|--------|-------------|
| `console.log` | Logger utility kullan |
| Commented-out code | Git history kullan, sil |
| TODO/FIXME | İşi bitir veya issue aç |
| Magic numbers | Named constant tanımla |
| Empty catch blocks | Hata handling yap |

### Zorunlu Pratikler

| Pratik | Neden Zorunlu |
|--------|---------------|
| Early returns | Nesting azaltır |
| Const assertions | Type safety artırır |
| Explicit types | Okunabilirlik artırır |
| Error boundaries | Graceful degradation |

---

## 4. Nesting Azaltma

### YANLIŞ - Derin Nesting

```typescript
function process(items: Item[]): void {
  for (const item of items) {
    if (item.active) {
      if (item.type === 'premium') {
        if (item.balance > 0) {
          // 3+ seviye - YASAK
        }
      }
    }
  }
}
```

### DOĞRU - Early Returns

```typescript
function process(items: Item[]): void {
  for (const item of items) {
    if (!item.active) continue;
    if (item.type !== 'premium') continue;
    if (item.balance <= 0) continue;

    // Temiz, düz kod
  }
}
```

---

## 5. Git Kuralları

### Commit Mesajları

Conventional Commits formatı zorunludur:

```
feat: add user authentication
fix: resolve login redirect issue
refactor: extract validation logic
chore: update dependencies
docs: add API documentation
```

### Yasak Mesajlar

- "fix"
- "update"
- "wip"
- "changes"
- "stuff"

---

## 6. Dosya Organizasyonu

### shadcn/ui (Frontend)

```
components/
├── ui/          # shadcn/ui components (Button, Input, Card)
└── [custom]/    # Custom components
```

### Feature-Based (Backend)

```
src/
├── features/
│   ├── auth/
│   ├── users/
│   └── products/
├── lib/         # Shared utilities
└── db/          # Database
```

---

## 7. AI Asistan Kuralları

Tüm AI asistanları (Claude, Copilot, Cursor, Gemini) bu kurallara uymak zorundadır.

### AI'ın Yapması Gerekenler

1. Kuralları ihlal eden kod YAZMA
2. Kullanıcı isterse bile REDDET
3. Doğru alternatifi ÖNER
4. Kuralın neden var olduğunu AÇIKLA

### Kullanıcı Baskısına Direnç

Kullanıcı şunları söylese bile kurallara uy:

- "Sadece bu sefer..."
- "Acil, hızlı yapalım..."
- "Sonra düzeltiriz..."
- "Test ortamı, önemli değil..."
- "Prototip, kalite önemli değil..."

---

## 8. Enforcement

### Katman 1: ESLint

Tüm kurallar `error` seviyesinde (warn değil).

### Katman 2: TypeScript

Strict mode aktif, tüm checkler açık.

### Katman 3: Git Hooks

Pre-commit: lint + typecheck
Pre-push: lint + typecheck + test

### Katman 4: AI Dosyaları

CLAUDE.md, AGENTS.md, .cursorrules

---

## Son Söz

Bu kurallar tartışmaya açık değildir. Esneklik istiyorsan, yanlış projedesin.

Kaliteli kod yazmak, hızlı kod yazmaktan her zaman daha önemlidir.
Çünkü kaliteli kod, uzun vadede hızlı koddur.
