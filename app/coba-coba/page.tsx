"use client";
import React, { useState } from "react";
import Deck from "@/src/coba2/Deck";
import { CardData } from "@/src/coba2/types";

export default function Home() {
  // DEK 1: Informasi Perpustakaan UGM
  const [perpustakaanCards] = useState<CardData[]>([
    {
      id: "ugm-4",
      title: "Fasilitas Perpustakaan UGM",
      description:
        "Perpustakaan UGM menyediakan akses Wi-Fi di seluruh area, ruang belajar mandiri dan kelompok, ruang diskusi, kafe baca, serta taman belajar. Tersedia pula lebih dari 100 unit komputer untuk mengakses internet dan katalog online. ",
      image:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=900&auto=format&fit=crop",
    },
    {
      id: "ugm-3",
      title: "Layanan dan Akses Sumber Informasi",
      description:
        "Perpustakaan UGM menyediakan layanan peminjaman dan pengembalian koleksi, layanan referensi, serta layanan terbitan berkala. Tersedia pula layanan khusus seperti Koleksi Langka Hatta. Pengguna juga dapat mengakses lebih dari 40 paket jurnal, buku, dan basis data elektronik melalui SSO UGM.",
      image:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=900&auto=format&fit=crop",
    },
    {
      id: "ugm-2",
      title: "Visi dan Misi Perpustakaan UGM",
      description:
        "Perpustakaan UGM memiliki visi menjadi pusat layanan informasi global berbasis teknologi informasi yang mendukung pembelajaran berbasis riset. Untuk mewujudkan tujuan jangka panjang tersebut, Misi yang telah ditentukan adalah menjadi pusat referensi ilmiah, mendukung Tri Dharma Perguruan Tinggi, dan menjadi rumah kedua bagi sivitas akademika.",
    },
    {
      id: "ugm-1",
      title: "Profil Perpustakaan UGM",
      description:
        "Berdiri sejak 1 Maret 1951, Perpustakaan UGM telah mendukung kegiatan mahasiswa dalam pembelajaran, penelitian, dan pengabdian kepada masyarakat. Sistem Perpustakaan UGM telah terintegrasi melalui Perpustakaan Pusat di Bulaksumur, 18 perpustakaan fakultas, serta Sekolah Vokasi dan Sekolah Pascasarjana.",
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=900&auto=format&fit=crop",
    },
  ]);

  const [gmcCards] = useState<CardData[]>([
    {
      id: "gmc-4",
      title: "Hak dan Kewajiban Pasien",
      description:
        "Pasien berhak memperoleh layanan kesehatan yang adil dan bermutu, perlindungan kerahasiaan rekam medis, keterbukaan informasi biaya, keselamatan selama menjalani pelayanan, serta hak untuk memberikan persetujuan tindakan medis. Pasien juga berkewajiban memberikan informasi kesehatan secara jujur, mematuhi petunjuk tenaga kesehatan, dan menyelesaikan administrasi pelayanan sesuai ketentuan.",
    },
    {
      id: "gmc-3",
      title: "Jadwal dan Kuota Layanan",
      description:
        "Poli Umum dan Poli Gigi melayani pasien pada hari Senin sampai Jumat pukul 07.30–12.00 WIB dan 14.00–18.00 WIB, serta hari Sabtu pada sesi pagi dan siang. Layanan Konseling Psikologi tersedia pada hari Senin sampai Sabtu hingga pukul 18.30 WIB. Pendaftaran layanan psikologi dibuka secara daring setiap hari Senin pukul 10.00 WIB. Poli Refraksi Mata hanya beroperasi pada hari Kamis dengan kuota maksimal 15 pasien setiap minggu.",
    },
    {
      id: "gmc-2",
      title: "Poliklinik dan Pendaftaran",
      description:
        "Poli Umum melayani penanganan kesehatan tingkat pertama dan menyediakan anjungan mandiri bagi pasien lama. Poli Gigi menerima pendaftaran daring setiap Jumat pukul 08.00 WIB, sementara Konseling Gizi hanya melayani pendaftaran luring. Untuk layanan vaksinasi, pasien wajib mengonfirmasi ketersediaan vaksin melalui WhatsApp di nomor 0895-3231-00944 sebelum berkunjung.",
      image:
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=900&auto=format&fit=crop",
    },
    {
      id: "gmc-1",
      title: "Profil Gadjah Mada Medical Center",
      description:
        "Gadjah Mada Medical Center (GMC) merupakan pusat layanan kesehatan primer dan klinik dokter keluarga di bawah naungan Universitas Gadjah Mada yang melayani sivitas akademika maupun masyarakat umum. GMC berlokasi di Jalan Sekip Blok L3, Sendowo. Informasi administrasi dapat diperoleh melalui nomor 0813-2878-6991 atau pos-el gmc.hc@ugm.ac.id.",
      image:
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=900&auto=format&fit=crop",
    },
  ]);

  const [museumCards] = useState<CardData[]>([
    {
      id: "museum-3",
      title: "Keunikan dan Manfaat Museum",
      description:
        "Museum ini merupakan satu-satunya museum biopaleoantropologi di Indonesia. Gedung museum dinamai sebagai bentuk penghormatan kepada Prof. Teuku Jacob. Di halaman depan terdapat tiga kelompok patung ikonik yang menggambarkan tahapan evolusi primata. Keberadaan museum memberikan manfaat besar sebagai sarana penelitian bagi sivitas akademika sekaligus sebagai destinasi edukasi bagi masyarakat.",
      image:
        "https://images.unsplash.com/photo-1601987077677-5346c0c57d3f?q=80&w=900&auto=format&fit=crop", // Ilustrasi galeri patung/pameran museum
    },
    {
      id: "museum-2",
      title: "Koleksi Sejarah dan Anatomi",
      description:
        "Museum menyajikan berbagai artefak, fosil manusia purba, tulang subresen, dan replika kera besar. Bagian anatomi menampilkan gambaran sistem rangka, otot, jaringan tubuh, organ, hingga spesimen embriologi manusia yang disajikan sesuai dengan ukuran aslinya.",
    },
    {
      id: "museum-1",
      title: "Profil dan Sejarah Museum",
      description:
        "Museum Bio-Paleoantropologi dan Anatomi merupakan fasilitas pendidikan di bawah naungan Fakultas Kedokteran, Kesehatan Masyarakat, dan Keperawatan Universitas Gadjah Mada (FK-KMK UGM). Museum ini berdiri pada 9 September 1989 dan diresmikan oleh Menteri Pendidikan dan Kebudayaan Republik Indonesia, Prof. Dr. Fuad Hasan, bertepatan dengan peringatan 100 tahun penelitian paleoantropologi di Indonesia. Wajah baru museum yang lebih modern diresmikan oleh Rektor UGM, Prof. dr. Ova Emilia, pada 28 Oktober 2024.",
      image:
        "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=900&auto=format&fit=crop", // Ilustrasi gedung/lorong utama museum yang modern
    },
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-12 px-4 overflow-x-hidden antialiased selection:bg-indigo-500/30">
      <div className="text-center mb-16 max-w-2xl px-4">
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-300 mt-4">
          PionirPedia
        </h1>
      </div>

      <div className="w-full max-w-5xl flex flex-col gap-24 items-center">
        {/* DEK 1: PERPUSTAKAAN UGM */}
        <section className="w-full flex flex-col items-center">
          <div className="text-center mb-2">
            <h2 className="text-2xl font-bold text-slate-300 tracking-tight">
              1. Perpustakaan Universitas Gadjah Mada
            </h2>
            <p className="text-md text-slate-200">
              Menjelajahi jendela dunia, layanan literasi, dan fasilitas modern
              penunjang riset.
            </p>
          </div>
          <div className="w-full flex justify-center items-center min-h-[4vh] relative">
            <Deck initialCards={perpustakaanCards} />
          </div>
        </section>

        {/* DEK 2: GMC HEALTH CENTER */}
        <section className="w-full flex flex-col items-center">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
              2. Gadjah Mada Medical Center (GMC)
            </h2>
            <p className="text-md text-slate-300 mt-1">
              Pusat layanan kesehatan primer, poliklinik spesifik, dan regulasi
              pelayanan pasien.
            </p>
          </div>
          <div className="w-full flex justify-center items-center min-h-[50vh] relative">
            <Deck initialCards={gmcCards} />
          </div>
        </section>

        {/* DEK 3: MUSEUM BIO-PALEOANTROPOLOGI DAN ANATOMI */}
        <section className="w-full flex flex-col items-center">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
              3. Museum Bio-Paleoantropologi dan Anatomi
            </h2>
            <p className="text-md text-slate-200 mt-1">
              Wahana edukasi rekam jejak evolusi manusia purba dan kompleksitas
              anatomi tubuh.
            </p>
          </div>
          <div className="w-full flex justify-center items-center min-h-[50vh] relative">
            <Deck initialCards={museumCards} />
          </div>
        </section>
      </div>

      {/* FOOTER SOURCE */}
      <footer className="mt-24 border-t border-slate-900 pt-8 w-full max-w-2xl text-center text-[16px] text-slate-100 tracking-wide flex flex-col gap-2">
        <p>
          Sumber data resmi:{" "}
          <a
            href="https://ugm.ac.id"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline transition-colors"
          >
            ugm.ac.id
          </a>{" "}
          |{" "}
          <a
            href="https://research.fkkmk.ugm.ac.id"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline transition-colors"
          >
            research.fkkmk.ugm.ac.id
          </a>
        </p>
        <p className="text-[12px] text-slate-200">
          Disusun ulang secara komprehensif sesuai dengan standar ortografi EYD
          Edisi V.
        </p>
      </footer>
    </main>
  );
}
