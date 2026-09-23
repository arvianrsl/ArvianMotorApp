// Data referensi kode kedipan MIL (Malfunction Indicator Lamp) pada sistem
// PGM-FI Honda. Cara baca: MIL menyala ~2 detik saat kontak ON lalu mati jika
// normal. Jika ada gangguan, MIL berkedip berulang: kedipan panjang (±1.3
// detik) bernilai 10, kedipan pendek (±0.3 detik) bernilai 1 — jumlahkan
// untuk mendapatkan nomor kodenya.
const FI_CODES = [
  {
    code: 1,
    component: "Sensor MAP",
    long: "Manifold Absolute Pressure",
    indication: "Sensor tekanan udara di intake manifold tidak terbaca normal.",
    effect: "Tarikan motor terasa berat dan tenaga di putaran atas berkurang.",
    action: "Cek soket dan kabel sensor MAP, bersihkan konektor, jika masih error bawa ke bengkel untuk cek/ganti sensor."
  },
  {
    code: 7,
    component: "Sensor EOT / ECT",
    long: "Engine Oil/Coolant Temperature",
    indication: "Sensor suhu oli atau cairan pendingin mesin bermasalah.",
    effect: "ECM salah membaca suhu mesin sehingga campuran bahan bakar jadi tidak tepat.",
    action: "Periksa kondisi sensor dan sambungan kabel di area mesin, ganti bila terbukti rusak."
  },
  {
    code: 8,
    component: "Sensor TP",
    long: "Throttle Position",
    indication: "Sensor posisi bukaan gas tidak mengirim sinyal yang wajar.",
    effect: "Respon gas terasa tersendat atau idle tidak stabil.",
    action: "Cek posisi dan kebersihan sensor throttle, kalibrasi ulang di AHASS bila perlu."
  },
  {
    code: 9,
    component: "Sensor IAT",
    long: "Intake Air Temperature",
    indication: "Sensor suhu udara masuk tidak terbaca dengan benar.",
    effect: "Campuran bahan bakar-udara jadi kurang presisi, konsumsi BBM bisa meningkat.",
    action: "Bersihkan area sensor dari kotoran/debu, cek konektor kabel."
  },
  {
    code: 11,
    component: "Sensor VS",
    long: "Vehicle Speed",
    indication: "Sinyal sensor kecepatan kendaraan tidak terdeteksi.",
    effect: "Spidometer bisa tidak akurat dan sistem idle-stop (jika ada) tidak berfungsi.",
    action: "Periksa kabel sensor speed di roda/gearbox, cek konektor."
  },
  {
    code: 12,
    component: "Injektor",
    long: "Fuel Injector",
    indication: "Rangkaian atau kerja injektor bahan bakar tidak normal.",
    effect: "Mesin sulit menyala, brebet, atau mati mendadak.",
    action: "Segera periksa ke bengkel — komponen ini berkaitan langsung dengan pasokan bahan bakar ke mesin."
  },
  {
    code: 21,
    component: "Sensor O2",
    long: "Oxygen Sensor",
    indication: "Sensor oksigen di knalpot tidak membaca kadar gas buang dengan wajar.",
    effect: "Efisiensi bahan bakar menurun dan emisi gas buang bisa lebih tinggi.",
    action: "Cek sambungan sensor O2, bersihkan dari kerak karbon bila perlu diperiksakan ke teknisi."
  },
  {
    code: 29,
    component: "IACV",
    long: "Idle Air Control Valve",
    indication: "Katup pengatur udara idle tersendat atau macet.",
    effect: "Putaran mesin saat langsam naik-turun tidak stabil.",
    action: "Bersihkan throttle body dan katup IACV, atau bawa ke bengkel untuk servis."
  },
  {
    code: 33,
    component: "ECM",
    long: "Engine Control Module",
    indication: "Modul pengendali mesin mendeteksi masalah pada memorinya sendiri.",
    effect: "Sistem injeksi bisa berjalan tidak semestinya secara keseluruhan.",
    action: "Perlu pengecekan unit ECM oleh teknisi berpengalaman, biasanya di AHASS."
  },
  {
    code: 52,
    component: "Sensor CKP",
    long: "Crankshaft Position",
    indication: "Sensor posisi poros engkol tidak mengirim sinyal putaran mesin.",
    effect: "Mesin bisa sulit distarter atau mati total.",
    action: "Periksa kabel dan posisi sensor CKP di area magnet/CVT, segera ke bengkel."
  },
  {
    code: 54,
    component: "Sensor BAS",
    long: "Bank Angle Sensor",
    indication: "Sensor kemiringan motor mendeteksi sudut yang tidak wajar atau bermasalah.",
    effect: "Sebagai fitur keamanan, mesin bisa otomatis mati bila sudut kemiringan dianggap ekstrem.",
    action: "Cek posisi sensor tidak bergeser/terbentur, reset dengan kunci kontak OFF-ON, jika berulang periksakan ke bengkel."
  }
];

// Referensi interval servis umum motor matic Honda — dipakai untuk mengisi
// pengingat sederhana di halaman Records. Bisa disesuaikan per model.
const SERVICE_TYPES = [
  { id: "oli-mesin", label: "Ganti Oli Mesin", intervalKm: 2000 },
  { id: "servis-rutin", label: "Servis Rutin / Tune Up", intervalKm: 4000 },
  { id: "oli-gardan", label: "Ganti Oli Gardan (CVT)", intervalKm: 8000 },
  { id: "kampas-rem", label: "Ganti Kampas Rem", intervalKm: 10000 },
  { id: "aki", label: "Cek/Ganti Aki", intervalKm: null },
  { id: "busi", label: "Ganti Busi", intervalKm: 8000 },
  { id: "ban", label: "Ganti Ban", intervalKm: null },
  { id: "lainnya", label: "Lainnya", intervalKm: null }
];
