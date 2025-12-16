# Parking Ticket IoT

Sistem ticketing parkir berbasis **IoT** dengan **Express.ts** untuk backend dan **SvelteKit** untuk frontend.  
Perangkat IoT dengan tombol button sebagai triger terhubung via **USB Serial (SerialPort)** ke backend untuk generate tiket parkir secara otomatis.

---

## 🚀 Fitur Utama

- Integrasi dengan **IoT device via SerialPort (USB Serial)**  
- Generate tiket parkir secara otomatis saat tombol IoT ditekan 
- Frontend modern menggunakan **SvelteKit**  
- Backend Ts dengan framework **Express**
- SSE

---

## 📁 Struktur Project

```
parking-ticket-iot/
├─ backend/
├─ client/
├─ iot/
├─ .gitignore
└─ README.md
```

---

## ⚙️ Instalasi
```bash
git clone https://github.com/afriansyogs/parking-ticket-iot.git
cd parking-ticket-iot

cd backend
npm install

cd ../client
npm install
```
---

## NOTED:
- Sesuaikan serial portnya pada backend dengan device iot yang anda hubungkan ke laptop
- Code Iot digunakan untuk menjalankan project iot, code terserbut perlu component iot dan microcontroller(ESP32) detailnya ada di README.MD pada directory iot/