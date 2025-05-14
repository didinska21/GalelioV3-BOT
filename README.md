
# GalelioV3-BOT

**GalelioV3-BOT** adalah bot otomatis untuk melakukan transaksi swap token di jaringan **0G Zer0 Testnet** menggunakan **ethers.js**. Bot ini akan melakukan transaksi swap antara beberapa token (USDT, BTC, dan ETH) secara otomatis berdasarkan input jumlah transaksi yang dimasukkan.

## Persyaratan

- **Node.js** versi 16 atau lebih tinggi
- **npm** atau **yarn**
- **Akun Ethereum** yang terhubung dengan **0G Zer0 Testnet** dan memiliki saldo token.
- **Private Key** dari dompet Ethereum yang akan digunakan untuk swap.
- **Faucet** untuk mendapatkan saldo token di jaringan 0G Zer0 Testnet (jika diperlukan).

## Langkah-langkah Install dan Menjalankan

### 1. Clone Repositori dari GitHub

Langkah pertama adalah meng-clone repositori **GalelioV3-BOT** ke dalam direktori lokal kamu:

```bash
git clone https://github.com/didinska21/GalelioV3-BOT.git
cd GalelioV3-BOT
```

### 2. Instalasi Dependensi

Setelah kamu berada di dalam direktori bot, jalankan perintah berikut untuk menginstal semua dependensi yang dibutuhkan:

```bash
npm install
```

atau jika kamu menggunakan **yarn**:

```bash
yarn install
```

### 3. Siapkan File `.env`

Setelah dependensi terinstal, buat file `.env` di dalam direktori proyek dan isi dengan konfigurasi berikut:

```bash
# RPC endpoint jaringan 0G Zer0 Testnet
RPC=https://evmrpc-testnet.0g.ai/

# Private key wallet kamu (JANGAN dibagikan ke siapa pun!)
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

# Alamat kontrak router swap
ROUTER=0xD86b764618c6E3C078845BE3c3fCe50CE9535Da7

# Alamat kontrak token-token di jaringan 0G Zer0 Testnet
USDT=0x3eC8A8705bE1D5ca90066b37ba62c4183B024ebf
ETH=0x0fE9B43625fA7EdD663aDcEC0728DD635e4AbF7c
BTC=0x36f6414FF1df609214dDAbA71c84f18bcf00F67d
```

Gantilah `PRIVATE_KEY` dengan private key dari dompet yang akan digunakan.

### 4. Jalankan Bot

Setelah semuanya terkonfigurasi, kamu bisa menjalankan bot dengan perintah berikut:

```bash
npm start
```

atau jika kamu menggunakan **yarn**:

```bash
yarn start
```

### 5. Input Jumlah Transaksi

Bot akan meminta kamu untuk memasukkan jumlah transaksi yang ingin dilakukan. Masukkan angka antara 1 hingga 100, dan bot akan memulai transaksi untuk setiap kombinasi token sesuai yang telah ditentukan.

Misalnya, jika kamu memasukkan `5`, bot akan melakukan 5 transaksi swap, dengan urutan sebagai berikut:

- **USDT â†’ ETH**
- **USDT â†’ BTC**
- **ETH â†’ USDT**
- **ETH â†’ BTC**
- **BTC â†’ USDT**
- **BTC â†’ ETH**

### 6. Monitoring dan Hasil

Setelah transaksi selesai, bot akan menampilkan hasilnya, termasuk status keberhasilan atau kegagalan untuk setiap transaksi yang dilakukan.

## Troubleshooting

- **Masalah: Tidak ada saldo di token yang digunakan.**
  - Pastikan saldo token yang digunakan cukup untuk melakukan transaksi. Kamu bisa menggunakan faucet di jaringan 0G Zer0 Testnet untuk mendapatkan token gratis.

- **Masalah: Gagal melakukan transaksi.**
  - Pastikan koneksi RPC ke jaringan 0G Zer0 Testnet berjalan dengan baik.
  - Periksa kembali alamat kontrak token yang digunakan di file `.env`.

---

Jika ada pertanyaan lebih lanjut, silakan kunjungi repositori GitHub atau hubungi saya di Telegram: [t.me/didinska](https://t.me/didinska).

---

**Selamat mencoba dan semoga berhasil!**
