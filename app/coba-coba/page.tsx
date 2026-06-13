"use client";
import React, { useState } from "react";
import Deck from "@/src/coba2/Deck";
import { CardData } from "@/src/coba2/types";
import { Stethoscope, BookOpen, Skull } from "lucide-react";

type ActiveTab = "gmc" | "library" | "museum";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("gmc");

  // DECK 1: GADJAH MADA MEDICAL CENTER (GMC) - Diurutkan dari 5 ke 1
  const [gmcCards] = useState<CardData[]>([
    {
      id: "gmc-5",
      title: "Saluran Kontak Resmi",
      description:
        "Hubungi layanan pusat panggilan GMC pada jam kerja resmi:<br/><br/>• <b>Pos-el (Email):</b> <span class='text-amber-400 underline'>gmc.hc@ugm.ac.id</span><br/>• <b>Layanan Pelanggan:</b> 0811-2944-064<br/>• <b>Informasi Umum:</b> 0811-2944-064",
      link: "https://gmc.ugm.ac.id/",
    },
    {
      id: "gmc-4",
      title: "Alur Pendaftaran Pasien",
      description:
        "<b>Pasien Baru (Luring):</b><br/>Datang langsung ke meja pendaftaran dengan membawa kartu identitas diri yang sah.<br/><br/><b>Pasien Lama (Mandiri):</b><br/>Gunakan mesin anjungan elektronik mandiri, masukkan data diri, pilih poli tujuan, lalu cetak nomor antrean.",
      link: "https://gmc.ugm.ac.id/",
    },
    {
      id: "gmc-3",
      title: "Fasilitas & Poliklinik",
      description:
        "GMC menyediakan fasilitas kesehatan terpadu penunjang medis harian:<br/><br/>• <b>Poli Umum</b> dan <b>Poli Gigi</b><br/>• <b>Konseling Psikologi</b> dan Klinik <i>Fitness Center</i><br/>• Layanan <b>Ambulans Gawat Darurat</b> gratis untuk evakuasi pasien.",
      image: "/GMC.png",
      link: "https://gmc.ugm.ac.id/",
    },
    {
      id: "gmc-2",
      title: "Lokasi & Jam Operasional",
      description:
        "<b>Lokasi Klinik:</b><br/>Jl. Sekip Blok L3, Sendowo, Mlati, Sleman, DI Yogyakarta 55281.<br/><br/><b>Jam Operasional Resmi:</b><br/>• Senin – Jumat: pukul 07.30 – 19.30 WIB<br/>• Sabtu: pukul 08.00 – 18.00 WIB",
      image: "/gmc2.png",
      link: "https://gmc.ugm.ac.id/",
    },
    {
      id: "gmc-1",
      title: "Profil Utama GMC UGM",
      description:
        "<b>Gadjah Mada Medical Center (GMC)</b> adalah klinik dokter keluarga primer resmi di bawah naungan <i>Universitas Gadjah Mada</i>.<br/><br/>GMC berkomitmen memberikan pelayanan kesehatan tingkat pertama yang komprehensif, bermutu, dan terjangkau bagi seluruh sivitas akademika maupun masyarakat umum.",
      image: "/gmc3.png",
      link: "https://gmc.ugm.ac.id/",
    },
  ]);

  // DECK 2: PERPUSTAKAAN PUSAT UGM - Diurutkan dari 5 ke 1
  const [libraryCards] = useState<CardData[]>([
    {
      id: "lib-5",
      title: "Operasional Sabtu & Kontak",
      description:
        "<b>Hari Sabtu:</b><br/>• <b>08.00–12.00:</b> Ruang ETD.<br/>• <b>08.00–16.00:</b> Ruang WOW, Ruang Belajar Lt. 1, Ruang Diskusi, dan Meja Informasi.<br/><br/>• <b>Pos-el (Email):</b> library@ugm.ac.id<br/>• <b>Kontak Admin:</b> 0811-2944-064",
      link: "https://lib.ugm.ac.id/",
    },
    {
      id: "lib-4",
      title: "Jam Operasional Senin – Jumat",
      description:
        "<b>Senin – Jumat:</b><br/>• <b>08.00–16.00:</b> R. Koleksi Langka, R. Ilmu Sosial, R. Berkala.<br/>• <b>08.00–20.00:</b> R. ETD, R. Sirkulasi, R. Belajar Mandiri Lt. 5.<br/>• <b>08.00–22.00:</b> R. WOW, R. Belajar Lt. 1, R. Diskusi, R. TGCL, & Selasar Lt. 1.",
      link: "https://lib.ugm.ac.id/",
    },
    {
      id: "lib-3",
      title: "Alur Akses Masuk Pintu",
      description:
        "Cara masuk menggunakan aplikasi <b>Simaster VNext</b>:<br/>1. Buka aplikasi, pilih menu <i>Presensi / Attendance</i>.<br/>2. Klik opsi <i>Generate QR</i>.<br/>3. Pindai kode QR pada pemindai pintu (Gate IN) dengan layar HP terang menghadap ke atas. Gunakan kode yang sama saat keluar (Gate OUT).",
      image: "/perpusat3.JPG",
      link: "https://lib.ugm.ac.id/",
    },
    {
      id: "lib-2",
      title: "Fasilitas & Akses Jurnal",
      description:
        "Perpustakaan menyediakan infrastruktur belajar modern yang sangat lengkap:<br/><br/>• Akses Wi-Fi cepat di seluruh area gedung.<br/>• Ratusan ribu koleksi cetak, digital, dan jurnal ilmiah global.<br/>• Lebih dari 100 unit komputer siap pakai untuk penelusuran informasi.",
      image: "/perpusat2.JPG",
      link: "https://lib.ugm.ac.id/",
    },
    {
      id: "lib-1",
      title: "Profil & Lokasi Perpustakaan",
      description:
        "<b>Perpustakaan Pusat UGM</b> (berdiri sejak 1951) merupakan fasilitas akademik utama penyedia sumber pengetahuan untuk riset dan studi.<br/><br/><b>Lokasi Gedung:</b><br/>Kawasan Kampus UGM Bulaksumur, Caturtunggal, Depok, Sleman, Daerah Istimewa Yogyakarta 55281.",
      image: "/perpusat1.JPG",
      link: "https://lib.ugm.ac.id/",
    },
  ]);

  // DECK 3: MUSEUM BIO-PALEOANTROPOLOGI DAN ANATOMI - Diurutkan dari 5 ke 1
  const [museumCards] = useState<CardData[]>([
    {
      id: "mus-5",
      title: "Informasi Kontak Hubungan",
      description:
        "Untuk informasi izin penelitian khusus atau reservasi kunjungan kelompok besar, silakan hubungi korespondensi resmi laboratorium:<br/><br/>• <b>Pos-el (Email):</b> <span class='text-amber-400 underline'>museum.fk@ugm.ac.id</span>",
      link: "https://research.fkkmk.ugm.ac.id/museum-bio-paleoantropologi-dan-anatomi/",
    },
    {
      id: "mus-4",
      title: "Jam Operasional Kunjungan",
      description:
        "Museum dibuka untuk keperluan studi akademis mahasiswa maupun kunjungan masyarakat umum pada waktu berikut:<br/><br/>• <b>Senin – Jumat:</b> pukul 09.00 – 15.00 WIB.<br/>• <b>Sabtu, Minggu, & Hari Libur Nasional:</b> TUTUP.",
      link: "https://research.fkkmk.ugm.ac.id/museum-bio-paleoantropologi-dan-anatomi/",
    },
    {
      id: "mus-3",
      title: "Koleksi Anatomi Manusia",
      description:
        "Menyediakan media pembelajaran visual anatomi medis yang lengkap:<br/><br/>• Struktur sistem rangka dan susunan tulang tubuh.<br/>• Preparat organ dalam manusia asli yang diawetkan.<br/>• Visualisasi komprehensif fase perkembangan embrio manusia.",
      image: "/museum2.png",
      link: "https://research.fkkmk.ugm.ac.id/museum-bio-paleoantropologi-dan-anatomi/",
    },
    {
      id: "mus-2",
      title: "Koleksi Sejarah Purba",
      description:
        "Museum menyimpan beragam artefak prasejarah bernilai tinggi:<br/><br/>• Fosil asli dan replika manusia purba nusantara.<br/>• Spesimen keanekaragaman flora dan fauna purba kala.<br/>• Artefak batu dan peralatan kehidupan zaman berburu.",
      link: "https://research.fkkmk.ugm.ac.id/museum-bio-paleoantropologi-dan-anatomi/",
    },
    {
      id: "mus-1",
      title: "Profil & Lokasi Museum",
      description:
        "<b>Museum Bio-Paleoantropologi dan Anatomi</b> merupakan pusat rujukan ilmu pengetahuan di bawah naungan FK-KMK UGM yang memperkenalkan sejarah evolusi dan anatomi.<br/><br/><b>Lokasi Gedung:</b><br/>Kompleks FK-KMK UGM, Jalan Farmako, Sekip Utara, Yogyakarta.",
      image: "/museum1.png",
      link: "https://research.fkkmk.ugm.ac.id/museum-bio-paleoantropologi-dan-anatomi/",
    },
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-12 px-4 overflow-x-hidden antialiased selection:bg-amber-500/30">
      {/* HEADER UTAMA */}
      <div className="text-center mb-8 max-w-2xl">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-slate-100 to-yellow-500 mt-4">
          PionirPedia
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Pusat Informasi Aksesibilitas Kampus Premium
        </p>
      </div>

      {/* NAVIGASI TAB SELEKTOR (Fokus Responsif & Premium) */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 bg-slate-900/40 p-2.5 rounded-2xl border border-slate-800/80 backdrop-blur-md max-w-full">
        <button
          onClick={() => setActiveTab("gmc")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 ${
            activeTab === "gmc"
              ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          KLINIK GMC
        </button>

        <button
          onClick={() => setActiveTab("library")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 ${
            activeTab === "library"
              ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          PERPUSTAKAAN PUSAT
        </button>

        <button
          onClick={() => setActiveTab("museum")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 ${
            activeTab === "museum"
              ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
          }`}
        >
          <Skull className="w-4 h-4" />
          MUSEUM ANATOMI
        </button>
      </div>

      {/* AREA RETRIEVE KONTEN DECK */}
      <div className="w-full max-w-5xl flex flex-col items-center">
        <section className="w-full flex flex-col items-center">
          <div className="text-center mb-2">
            <h2 className="text-xl font-bold text-slate-200 tracking-tight transition-all duration-300">
              {activeTab === "gmc" && "Gadjah Mada Medical Center"}
              {activeTab === "library" && "Perpustakaan Pusat UGM"}
              {activeTab === "museum" &&
                "Museum Bio-Paleoantropologi & Anatomi"}
            </h2>
          </div>

          <div className="w-full flex justify-center items-center relative">
            {activeTab === "gmc" && (
              <Deck key="gmc-deck" initialCards={gmcCards} />
            )}
            {activeTab === "library" && (
              <Deck key="lib-deck" initialCards={libraryCards} />
            )}
            {activeTab === "museum" && (
              <Deck key="mus-deck" initialCards={museumCards} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
