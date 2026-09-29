# ArvianMotor PWA

Progressive Web App untuk project ArvianMotor — bisa dibuka di browser dan
di-install seperti aplikasi native di HP (Android & iOS).

## Isi project

```
arvianmotor-pwa/
├── index.html          # Semua halaman (Splash, Home, Records, FI Codes, Community) dalam 1 SPA
├── manifest.json        # Konfigurasi PWA (nama, warna, ikon, shortcut)
├── service-worker.js    # Bikin app bisa jalan offline & installable
├── css/styles.css       # Semua styling (tema navy #0D2B55 / orange #F97316)
├── js/
│   ├── app.js           # Logic: routing antar halaman, CRUD Records, install prompt
│   └── data.js          # Data referensi kode FI Honda & jenis servis
├── logoarvianmotor512.png.png  # Logo ArvianMotor (dipakai di splash, home, favicon)
├── icons/                # Ikon app (dibuat dari logo ArvianMotor)
└── README.md
```

## Fitur yang sudah jalan

- **Splash screen** → tombol "Get Start" lanjut ke Home (sesuai desain Figma).
- **Home** → ringkasan total catatan servis, servis terakhir, pengingat ganti
  oli, dan menu ke Records / FI Codes / Community.
- **Records** → tambah/hapus catatan servis (tanggal, jenis servis, km,
  catatan), tersimpan di HP lewat `localStorage` sehingga tetap ada meski
  offline atau app ditutup.
- **FI Codes** → daftar kode kedipan MIL Honda (arti, efek ke motor, saran
  tindakan) + pencarian.
- **Community** → tombol "Gabung Grup WhatsApp" yang membuka chat WhatsApp.
- **Bisa di-install** ke home screen lewat menu browser (banner "Pasang aplikasi" sudah dihapus).

## Cara menjalankan / preview di komputer

Service worker & install prompt **tidak jalan** kalau file dibuka langsung
lewat `file://`. Jalankan lewat local server dulu:

```bash
cd arvianmotor-pwa
python3 -m http.server 8080
```

Lalu buka `http://localhost:8080` di Chrome (desktop atau Android — bisa juga
lewat `chrome://inspect` untuk buka dari HP yang tersambung USB).

## Cara deploy supaya bisa di-install beneran di HP

PWA **wajib diakses lewat HTTPS** (kecuali localhost) supaya service worker
& tombol install muncul. Opsi termudah:

1. **Subdomain di domain yang sudah ada**, misal `app.arvianmotor.my.id`,
   lalu upload semua isi folder `arvianmotor-pwa/` ke situ (hosting apa saja
   yang sudah HTTPS otomatis, kayak Netlify, Vercel, GitHub Pages, atau
   cPanel hosting yang sudah ada SSL-nya).
2. **Netlify/Vercel (gratis & paling cepat untuk tugas kuliah)**: drag & drop
   folder ini ke Netlify Drop (https://app.netlify.com/drop), langsung dapat
   link HTTPS yang bisa dibuka & di-install dari HP.
3. **GitHub Pages**: push folder ini ke repo GitHub, aktifkan Pages di
   Settings → Pages, pilih branch-nya.

Setelah online, buka linknya di HP:

- **Android (Chrome)** → akan muncul banner "Pasang ArvianMotor di layar
  utama", atau lewat menu titik tiga → "Install app" / "Add to Home screen".
- **iPhone (Safari)** → tombol Share (kotak dengan panah ke atas) → "Add to
  Home Screen". iOS memang tidak mendukung banner otomatis, jadi ini harus
  manual (batasan dari Apple, bukan dari app-nya).

## Yang perlu disesuaikan sebelum dipakai beneran

- **Logo**: semua ikon di `icons/` sudah memakai logo ArvianMotor asli.
- **Nomor WhatsApp komunitas**: ada di `js/app.js`, cari variabel
  `WA_NUMBER` di bagian atas file, ganti sesuai nomor yang aktif.
- **Data kode FI**: ada di `js/data.js` (array `FI_CODES`), bisa
  ditambah/dikurangi sesuai model motor yang ingin dicover.
- **Interval pengingat servis**: ada di `js/data.js` (array
  `SERVICE_TYPES`, properti `intervalKm`).

## Kalau mau lanjut dikembangkan

- Data Records saat ini disimpan lokal di HP masing-masing user
  (`localStorage`) — belum sinkron ke server/akun. Kalau butuh data
  tersimpan di cloud dan bisa diakses lintas perangkat, perlu tambah
  backend (misal Firebase/Supabase) untuk auth + database.
- Push notification untuk pengingat servis butuh backend tambahan juga
  (Web Push), belum termasuk di versi ini.
