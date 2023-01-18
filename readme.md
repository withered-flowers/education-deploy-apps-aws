# Education Deploy Apps (AWS Version)

## Table of Contents

- [Persyaratan Dasar](#persyaratan-dasar)
- [Perkenalan](#perkenalan)
- [References](#references)

### Persyaratan Dasar

- Memiliki akun AWS
- Sudah menginstall nodejs dan memiliki akun Github

### Disclaimer

Pada pembelajaran ini sudah disediakan sebuah kode sederhana yang sudah disiapkan untuk di-deploy.

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
1. Setelah selesai, maka secara otomatis kita sudah berhasil menginstall NodeJS. mudah bukan?

#### Langkah 4 - Masukkan kode yang dibutuhkan ke dalam EC2

Selanjutnya kita akan mengclone kode yang dimiliki dari github ke dalam EC2. Langkah-langkahnya adalah sebagai berikut:

1. Masih pada terminal ubuntu EC2, clone repository ini dengan menggunakan perintah berikut:
   ```bash
   git clone https://github.com/withered-flowers/education-deploy-apps-aws.git
   ```
1. Cara di atas bisa dilakukan secara langsung **BILA MENGGUNAKAN REPOSITORY PUBLIK**, apabila menggunakan repository yang bersifat `private`, maka siapkan terlebih dahulu `Private Access Token` dari akun Github yang ingin diclone repositorynya.
1.

### References
