# E-Voting Himakom Unperta

Folder client hanya untuk development, website full ada di folder server

Menggunakan Express sebagai Web Server, Front End dengan TailwindCSS, Webpack

## Untuk Deploy

1. Set Environment Variable di folder Server sebagai berikut:
  - APP_NAME=e-voting-himakom (Nama Aplikasi (Tidak terlalu penting))
  - DB_NAME=e-voting-himakom (Nama Database)
  - DB_HOST=localhost (URL Database Server)
  - DB_PORT=3306 (Port Database Server)
  - DB_USER=root (User Database)
  - DB_PASS= (Password Database)
  - SECRET=thisissecret (Secret Code untuk Cookie Parser)
  - PORT=80 (Port dari Aplikasi)
  - DATABASE_URL="mysql://\${DB_USER}:\${DB_PASS}@\${DB_HOST}:\${DB_PORT}/\${DB_NAME}" (Setting untuk Prisma ORM)
2. Jalankan `npm install`
3. Jalankan `npx prisma migrate deploy`
4. Jalankan `npm start`

Jika ada masalah dalam menjalankan website, bisa hubungi saya... terima kasih.

[Github](https://github.com/VladRafli) [Email](mailto:rafli.jaskandi@gmail.com) [Website](https://vladrafli.github.io)