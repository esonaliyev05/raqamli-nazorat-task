# Bank Statements App

React + TypeScript + Redux Toolkit + Tailwind asosida yozilgan oddiy va tushunarli loyiha.

## Ishga tushirish

```bash
npm install
npm run dev
```

## Environment

`.env.example` fayldan nusxa oling:

```env
VITE_API_BASE_URL=http://localhost:8000/api/document
VITE_USE_MOCK=true
```

## Nimalar bor

- Dashboard sahifa
- GET /bank-statement/ ro'yxati
- DELETE uchun modal tasdiqlash
- Create/Edit dynamic master-detail forma
- Item qatorlarini qo'shish va o'chirish
- total_in va total_out real time hisoblanadi
- PATCH logikasi: item id bo'lsa update, bo'lmasa new item
- Mock data va real API toggle

## Eslatma

Mock rejim default yoqilgan. Real API ishlatish uchun `VITE_USE_MOCK=false` qiling.
