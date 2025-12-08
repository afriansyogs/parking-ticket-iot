# Parking Ticket IoT

Sistem ticketing parkir berbasis **IoT** dengan **Express.ts** untuk backend dan **SvelteKit** untuk frontend.  
Perangkat IoT dengan tombol button sebagai triger terhubung via **USB Serial (SerialPort)** ke backend untuk generate tiket parkir secara otomatis.

---

## 🚀 Fitur Utama

- Integrasi dengan **IoT device via SerialPort (USB Serial)**  
- Generate tiket parkir secara otomatis saat tombol 
- Frontend modern menggunakan **SvelteKit**  
- Backend REST API menggunakan **Express.js**

---

## 📁 Struktur Project

parking-ticket-iot/
├─ backend/ 
├─ client/ 
├─ .gitignore
└─ README.md

---

## ⚙️ Instalasi
**Clone repository**
cd parking-ticket-iot

cd backend
npm install

cd ../client
npm install