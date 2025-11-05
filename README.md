- Node.js
- express
- axios
- npm
- ngrok token olish

---

### 1. gitub dan loyihani nusxalash (clone)
```bash
git https://github.com/infinity-uz/I-CORP.git
```

### 2. Kerakli package o'rnatish npm dan
```bash
npm install
```

### 3. Dasturni ishga tushurish uchun 
```bash
node start
```

---

## Kod ishlash strukturasi


1. **Express server** 3333 run bo'ladi
2. **Ngrok dan vaqtinchalik PORT ochiladi**  va shundan rusxsat ochiladi
3. **1-POST so'rov yuboriladi** url ga PORT so'rovi ketadi
4. **1 code** post.data.part1 orqali (`part1`) orqali olinadi
5. **60 s** ikkinchi kod ni kutadi post.data.part2 orqali (`part2`) olinadi
6. Kelgan 2 ta kodni conCat orqali **birlashtiriladi**: `part1 + part2`
8. **Yakuniy natija** konsolda chiqadi

### API Endpoint lar

**POST/GET `/i-corp`** - Ikkinchi kod qismini (`part2`) qabul qiladi

Request misollari:
```json
POST: {"part2": "2-code"}
GET: /test-api?part2=2-code
```