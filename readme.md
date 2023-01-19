# Education Deploy Apps (AWS Version)

## Table of Contents

- [Persyaratan Dasar](#persyaratan-dasar)
- [Perkenalan](#perkenalan)
- [How To](#how-to)
  - [Langkah 1 - Membuat EC2 Instance](#langkah-1---membuat-ec2-instance)
  - [Langkah 2 - Masuk ke dalam EC2](#langkah-2---masuk-ke-dalam-ec2)
  - [Langkah 3 - Instalasi NodeJS](#langkah-3---instalasi-nodejs)
  - [Langkah 4 - Masukkan kode yang dibutuhkan ke dalam EC2](#langkah-4---masukkan-kode-yang-dibutuhkan-ke-dalam-ec2)
  - [Langkah 5 - Inisialisasi dan Menggunakan PM2 pada Aplikasi](#langkah-5---inisialisasi-dan-menggunakan-pm2-pada-aplikasi)
  - [Langkah 6 (Optional) - Update Aplikasi](#langkah-6-optional---update-aplikasi)
  - [Langkah 7 - Menggunakan Sub-Domain untuk mengakses Aplikasi](#langkah-7---menggunakan-sub-domain-untuk-mengakses-aplikasi)

### Persyaratan Dasar

- Mengerti perintah dasar pada Linux
- Memiliki akun AWS
- Memiliki sebuah domain yang siap digunakan
- Sudah menginstall nodejs dan memiliki akun Github

### Disclaimer

Pada pembelajaran ini sudah disediakan sebuah kode sederhana yang sudah disiapkan untuk di-deploy. Kode ini dibuat dalam `nodejs`.

Pada pembelajaran ini domain akan disetting dengan menggunakan `Cloudflare`

### Perkenalan

Pada pembelajaran sebelumnya (https://github.com/withered-flowers/education-deploy-apps) kita sudah belajar bagaimana cara deploy aplikasi ke Railway dan Firebase.

Pada pembelajaran ini kita akan mencoba untuk melakukan deploy yang lebih "native" lagi dengan menggunakan VPS (Elastic Compute Cloud / EC2) pada Amazon Web Service (AWS).

### How To

#### Langkah 1 - Membuat EC2 Instance

Cara untuk membuat EC2 Instance adalah sebagai berikut:

1. Membuat sebuah Akun AWS
1. Login dengan Akun AWS pada https://portal.aws.amazon.com/
1. Pada halaman utama (Dashboard), pilih Search Bar dan ketikkan EC2
1. Pada search Result yang ditemukan, pilih `EC2 (Virtual Servers in the Cloud)`, maka setelah itu akan berpindah ke halaman Dashboard EC2.
1. Pada Dashboard EC2, pilih `Launch Instance` untuk membuat sebuah VPS (Virtual Private Server) baru.
1. Untuk `Name and tags`, berikan nama untuk Instance yang informatif
1. Pada `Application and OS Images` untuk `image` yang dipilih, gunakan `Ubuntu`
1. Untuk `Application Machine Image`, gunakan `Ubuntu Server` yang terbaru. Pada saat tulisan ini dibuat, yang terbaru adalah `Ubuntu Server 22.04 LTS (HVM), SSD Volume Type`
1. Untuk `Instance Type`, gunakan `t2.micro`
1. Untuk `Key pair (login)`, kita akan membuat sebuah key pair yang baru dengan menekan `Create new key pair`
1. Untuk `Key pair name`, silahkan berikan nama yang informatif
1. Untuk `Key pair type`, gunakan `RSA` bila menggunakan `Windows`, gunakan `ED25519` bila menggunakan `Linux / MacOS`
1. Untuk `Private key file format` gunakan `.pem`, dan tekan tombol `Create key pair` dan secara otomatis browser akan mendownload sesuatu dengan ekstensi `.pem`
1. Untuk `Network settings`, centang untuk `Allow HTTPS traffic from the internet` dan `Allow HTTP traffic from the internet`
1. Sampai titik ini semua sudah selesai dan kita akan menekan tombol `Launch instance`
1. _voila_, sampai di sini kita sudah berhasil untuk membuat instance EC2

Selanjutnya kita akan masuk ke dalam EC2 dan menginstall kebutuhan untuk deployment

#### Langkah 2 - Masuk ke Dalam EC2

Cara untuk masuk (SSH) ke dalam EC2 lalu meng-install NodeJS adalah sebagai berikut:

1. Membuka kembali halaman dashboard EC2
1. Pilih pada SideBar `Instances` -> `Instances`
1. Pada halaman ini akan diberikan tabel list `Instance` yang sudah dibuat. Klik `Instance ID` yang ingin kita SSH, dan akan berpindah ke halaman detail dari `Instance` tersebut.
1. Tekan tombol `Connect`, kemudian pilih tab `SSH Client`
1. Pada halaman ini akan diberikan instruksi untuk melakukan SSH ke dalam `Instance` tersebut.
1. Pada instruksi ini akan diberikan sebuah `Command` yang harus dijalankan pada terminal. Contoh pada saat tulisan ini dibuat adalah sebagai berikut:
   ```bash
   ssh -i "nama_key_pair.pem" ubuntu@public_ip_dns
   ```
1. Buka terminal yang ada pada komputer lokal, dan lakukan `cd` untuk masuk ke dalam folder dimana `nama_key_pair.pem` berada.
1. Ketikkan perintah untuk mengubah permission pada `nama_key_pair.pem` sebagai berikut: `chmod 400 nama_key_pair.pem` (`chmod` ini hanya perlu dilakukan sekali saja)
1. Lalu ketikkan perintah yang ada di atas untuk masuk ke dalam `Instance` tersebut.
1. Selanjutnya akan diberikan pertanyaan seperti berikut:

   ```
   The authenticity of host 'xxxx (xxx.xxx.xxx.xxx)' cant be established.

   ED25519 key fingerprint is SHA256:xxxxxxxxxxxxxxxxxxx.

   This key is not known by any other names

   Are you sure you want to continue connecting (yes/no/[fingerprint])?
   ```

1. Jawablah dengan `yes`
1. Dan _voila_ kita sudah berhasil untuk masuk ke dalam `Instance` tersebut. Hal ini ditandai dengan informasi sebagai berikut

   ```
   Welcome to Ubuntu 22.04.1 LTS (GNU/Linux 5.15.0-1026-aws x86_64)

   * Documentation:  https://help.ubuntu.com
   * Management:     https://landscape.canonical.com
   * Support:        https://ubuntu.com/advantage

     System information as of xxxxxxxxx 2023

     System load:  0.0           Processes:             0
     Usage of /:   0.0% of 0GB   Users logged in:       0
     Memory usage: 0%            IPv4 address for eth0: xxx.xxx.xxx.xxx
     Swap usage:   0%

   0 updates can be applied immediately.


   The list of available updates is more than a week old.
   To check for new updates run: sudo apt update


   The programs included with the Ubuntu system are free software;
   the exact distribution terms for each program are described in the
   individual files in /usr/share/doc/*/copyright.

   Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
   applicable law.

   To run a command as administrator (user "root"), use "sudo <command>".
   See "man sudo_root" for details.

   ubuntu@ip-xxx-xxx-xxx-xxx:~$
   ```

#### Langkah 3 - Instalasi NodeJS

Selanjutnya kita akan mencoba untuk install nodejs pada EC2. Langkah-langkahnya adalah sebagai berikut:

1. Membuka halaman link berikut: https://github.com/nodesource/distributions/blob/master/README.md#using-ubuntu-1
1. Masih pada terminal (ssh) ubuntu, ketikkan perintah yang ada pada link di atas pada terminal ubuntu dan jalankan.
1. Setelah selesai, maka secara otomatis kita sudah berhasil menginstall NodeJS. mudah bukan? apakah sudah selesai? belum !
1. Install global package yang dibutuhkan untuk menjalankan aplikasi. nama packagenya adalah `pm2` (https://www.npmjs.com/package/pm2). Instalasinya adalah dengan menggunakan perintah berikut:
   ```bash
   sudo npm install -g pm2
   ```
1. PM2 ini adalah sebuah package yang akan digunakan untuk menjalankan aplikasi berbasis nodejs kita di dalam EC2. PM2 ini akan menjalankan aplikasi kita secara `daemon` / sebagai service. Jadi kita tidak perlu lagi menjalankan aplikasi kita secara manual setiap kali kita ingin menjalankannya.

Untuk menggunakan PM2-nya, akan dijelaskan lebih lanjut pada langkah di bawah nanti yah !

#### Langkah 4 - Masukkan kode yang dibutuhkan ke dalam EC2

Selanjutnya kita akan mengclone kode yang dimiliki dari github ke dalam EC2. Langkah-langkahnya adalah sebagai berikut:

1. Masih pada terminal ubuntu EC2, clone repository ini dengan menggunakan perintah berikut:
   ```bash
   git clone https://github.com/withered-flowers/education-deploy-apps-aws.git
   ```
1. Cara di atas bisa dilakukan secara langsung **BILA MENGGUNAKAN REPOSITORY PUBLIK**, apabila menggunakan repository yang bersifat `private`, maka siapkan terlebih dahulu `Private Access Token` dari akun Github yang ingin diclone repositorynya.
1. Untuk membuat `Private Access Token` dapat dilakukan dengan cara sebagai berikut:
   - Buka halaman `Settings` pada akun Github
   - Pilih `Developer settings` -> `Personal access tokens`
   - Pada halaman ini akan diberikan tabel list `Personal access tokens` yang sudah dibuat. Klik `Generate new token`
1. Selanjutnya setelah mendapatkan `Personal access token`, kita akan menggunakannya untuk mengclone repository yang bersifat `private` dengan menggunakan perintah `git clone <repository_private>`.
1. Pada saat diminta memasukkan credential, supply dengan username dari akun Github dan password yang dimasukkan adalah `Personal Access Token` yang sudah dibuat sebelumnya.
1. Sampai tahap ini artinya kita sudah berhasil mengclone repository dan memasukkan kode yang dibutuhkan ke dalam EC2.

#### Langkah 5 - Inisialisasi dan Menggunakan PM2 pada Aplikasi

Pada langkah ini kita akan mencoba untuk menginisialisasi dan menggunakan PM2 pada aplikasi yang sudah kita clone sebelumnya. Langkah-langkahnya adalah sebagai berikut:

1. Masih pada terminal EC2, `cd` ke dalam folder repository yang sudah di clone sebelumnya dan masuk ke dalam folder yang berisi `package.json`. (Apabila menggunakan repository dari `education-deploy-apps-aws` maka folder yang berisi `package.json` adalah `sources`)
1. Untuk melakukan inisialisasi `pm2` maka kita akan menggunakan perintah berikut:
   ```bash
   pm2 init simple
   ```
   Setelah menggunakan perintah ini maka akan terbentuk sebuah file baru bernama `ecosystem.config.js` yang berisi konfigurasi untuk menjalankan aplikasi kita menggunakan PM2.
1. (**STEP INI BELUM TENTU DIBUTUHKAN OLEH SEMUA APLIKASI**) Karena aplikasi yang digunakan dalam pembelajaran ini menggunakan nodejs `type: module`, maka untuk file `ecosystem.config.js` ini harus diubah menjadi `ecosystem.config.cjs`.

   Hal ini bisa dilakukan dengan menggunakan perintah:

   ```bash
   mv ecosystem.config.js ecosystem.config.cjs
   ```

1. Buka `ecosystem.config.(c)js` dengan menggunakan editor yang ada di Ubuntu EC2 (`vim` atau `nano`), kemudian tambahan sebuah property `env` untuk mengubah environment nodejs menjadi production seperti berikut:

   ```js
   module.exports = {
     apps: [
       {
         name: "app1",
         script: "./app.js",
         // --- Tambahkan baris ini
         env: {
           // Dibutuhkan untuk nodejs menganggap bahwa
           // kode berjalan pada production
           NODE_ENV: "production",
           // Dibutuhkan pada aplikasi app.js untuk
           // set port aplikasi
           PORT: 80,
         },
         // --- sampai di sini
       },
     ],
   };
   ```

1. Selanjutnya kita akan mencoba untuk menjalankan aplikasi yang telah dibuat. Tapi... masih ada satu `environment variable` (`env`) lagi bernama `SECRET` yang dibutuhkan dalam aplikasi ini. Hanya saja karena ini adalah sesuatu yang bersifat "rahasia", tidak boleh dituliskan ke dalam `ecosystem.config.(c)js`.

   Sehingga satu satunya cara meng-set `env` ini adalah sambil menjalankan aplikasi dengan `pm2`

1. Untuk bisa menjalankan aplikasi ini dengan `pm2` dan meng-set `env` bernama `SECRET` adalah dengan cara berikut:

   ```bash
   sudo SECRET=haloinirahasiasekali pm2 start ecosystem.config.cjs
   ```

   Apabila sudah berhasil maka akan muncul output seperti berikut:

   ```
   [PM2] Spawning PM2 daemon with pm2_home=/root/.pm2
   [PM2] PM2 Successfully daemonized
   [PM2] Starting /home/ubuntu/education-deploy-apps-aws/sources/app.js in fork_mode (1 instance)
   [PM2] Done.
   ```

1. Dan sampai pada tahap ini artinya kita sudah berhasil untuk mendeploy aplikasi kita pada AWS EC2 dengan baik !

   Untuk bisa membuka aplikasi yang sudah kita deploy, kita bisa menggunakan `public IP` dari EC2 yang kita miliki.

   Pada browser gunakan protokol `http` dan masukkan `public IP` dari EC2 yang kita miliki. Contoh: `http://18.100.100.100`

   _voila_... aplikasi kita sudah bisa diakses dari browser !

#### Langkah 6 (Optional) - Update Aplikasi

Langkah ini akan digunakan apabila terdapat error pada code kita dan kita harus update aplikasi yang dimiliki:

1. Cek terlebih dahulu apakah pm2-nya sudah berjalan atau belum dengan menggunakan perintah: `sudo pm2 list`
1. Apabila pada list belum ada apps yang berjalan, maka kita bisa menjalankan kode yang terbaru dengan menggunakan perintah:
   ```bash
   sudo SECRET=haloinirahasiasekali pm2 start ecosystem.config.cjs
   ```
1. Apabila pada list sudah ada apps yang berjalan, maka kita cukup melakukan restart apps dengan menggunakan perintah `sudo pm2 restart app1`

   Dimana `app1` adalah nama dari apps yang berjalan (lihat pada `name` yang ditunjukkan pada perintah `sudo pm2 list`)

1. Apabila yang ingin diupdate adalah `env`-nya, maka bisa menggunakan perintah berikut:

   ```bash
   sudo SECRET=bergantisecret pm2 restart app1 --update-env
   ```

1. Apabila ingin mematikan dan menghapus aplikasi yang berjalan, maka bisa menggunakan perintah berikut:
   ```bash
   sudo pm2 stop app1 && sudo pm2 del app1
   ```

#### Langkah 7 - Menggunakan Sub-Domain untuk mengakses Aplikasi

Sampai tahap ini artinya kita sudah berhasil untuk mendeploy aplikasi kita pada AWS EC2 dengan baik ! Namun, untuk mengakses aplikasi kita masih menggunakan IP Address dari EC2.

Untuk mengakses aplikasi kita dengan menggunakan sub-domain, maka kita perlu melakukan beberapa langkah berikut:

1. Login dengan akun `Cloudflare` yang dimiliki dan sudah memiliki domain
1. Pilih domain yang akan digunakan untuk mengakses aplikasi kita
1. Pilih tab `DNS` pada sidebar
1. Pilih tombol `Add Record`
1. Untuk menempelkan sub-domain yang bisa diakses dari domain yang dimiliki maka kita akan menambahkan record `A` pada DNS dengan mengisi pada konfigurasi recordnya sebagai berikut:
   - Type: `A`
   - Name: `NamaSubDomainYangDiinginkan`
   - IPV4 Address: `Public IP` dari EC2 yang kita miliki
   - Proxy Status: `Proxied`
1. Selanjutnya tekan tombol `Save` untuk menyimpan konfigurasi record yang telah dibuat
1. Tunggu beberapa saat (1-2 menit) kemudian _voila_... aplikasi kita sudah bisa diakses dari browser dengan menggunakan sub-domain yang dimiliki !

WARNING:

Hati-hati dengan menggunakan `Type` DNS Record. Ada 2 yang umumnya digunakan yaitu `A` dan `CNAME`.

- `A` digunakan untuk mengarahkan sub-domain ke IP Address
- `CNAME` digunakan untuk mengarahkan sub-domain ke domain lain

Sekian pembelajaran untuk deploy aplikasi Node.js ke AWS EC2. Semoga bermanfaat !
