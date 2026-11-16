import React, { useState, useRef } from 'react';
import './app.css';

function App() {
  // State data penyewa & pesanan
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    nik: '',
    deliveryLocation: 'Stasiun Tugu / Lempuyangan',
    rentalDays: 2,
  });

  // State khusus dokumen KTP
  const [ktpFile, setKtpFile] = useState(null);
  const [ktpPreview, setKtpPreview] = useState(null);
  const [ktpError, setKtpError] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  // State status pengiriman
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const fileInputRef = useRef(null);

  // Harga sewa motor contoh (Honda Vario 160)
  const pricePerDay = 110000;
  const totalPrice = pricePerDay * formData.rentalDays;

  // Handler perubahan input teks
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Khusus NIK, hanya izinkan angka maksimal 16 digit
    if (name === 'nik') {
      const numericValue = value.replace(/\D/g, '').slice(0, 16);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler validasi file KTP
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setKtpError('');

    if (!file) return;

    // 1. Validasi tipe file (hanya gambar)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setKtpError('Format tidak didukung. Harap unggah foto KTP asli (JPG, PNG, atau WEBP).');
      resetFile();
      return;
    }

    // 2. Validasi ukuran file (maksimal 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setKtpError('Ukuran file terlalu besar. Maksimal ukuran foto KTP adalah 5MB.');
      resetFile();
      return;
    }

    // Simpan file dan buat URL pratinjau
    setKtpFile(file);
    const previewUrl = URL.createObjectURL(file);
    setKtpPreview(previewUrl);
  };

  const resetFile = () => {
    setKtpFile(null);
    if (ktpPreview) {
      URL.revokeObjectURL(ktpPreview);
    }
    setKtpPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Cek apakah semua syarat keamanan terpenuhi sebelum tombol aktif
  const isSecurityValidated =
    formData.fullName.trim() !== '' &&
    formData.whatsapp.trim() !== '' &&
    formData.nik.length === 16 &&
    ktpFile !== null &&
    isAgreed;

  // Handler submit pesanan
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!ktpFile) {
      setKtpError('Wajib mengunggah foto KTP asli sebelum pesanan dapat diproses.');
      return;
    }

    if (formData.nik.length !== 16) {
      setKtpError('Nomor Induk Kependudukan (NIK) harus berjumlah 16 digit sesuai KTP.');
      return;
    }

    setIsSubmitting(true);

    // Persiapan payload FormData untuk dikirim ke API Backend
    const payload = new FormData();
    payload.append('fullName', formData.fullName);
    payload.append('whatsapp', formData.whatsapp);
    payload.append('nik', formData.nik);
    payload.append('deliveryLocation', formData.deliveryLocation);
    payload.append('rentalDays', formData.rentalDays);
    payload.append('totalPrice', totalPrice);
    payload.append('ktpDocument', ktpFile); // File KTP asli

    try {
      // Simulasi request API (ganti dengan endpoint asli Anda, misal: fetch('/api/orders', { method: 'POST', body: payload }))
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setOrderSubmitted(true);
    } catch (error) {
      setKtpError('Terjadi kesalahan saat mengunggah dokumen. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="navbar">
        <h1>AY Rental Motor - Verifikasi Sewa</h1>
        <span>Keamanan Terverifikasi</span>
      </header>

      {orderSubmitted ? (
        <div className="card success-banner">
          <h3>Pesanan Berhasil Dikirim & Menunggu Verifikasi Admin!</h3>
          <p>
            Terima kasih, <strong>{formData.fullName}</strong>. Dokumen KTP asli Anda telah diterima oleh sistem.
          </p>
          <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
            Tim kami akan memvalidasi keaslian KTP Anda sebelum armada <strong>Honda Vario 160</strong> diantar ke{' '}
            <strong>{formData.deliveryLocation}</strong>. Konfirmasi akan dikirim ke WhatsApp{' '}
            <strong>{formData.whatsapp}</strong>.
          </p>
          <button
            className="btn-submit"
            style={{ maxWidth: '250px', marginTop: '20px' }}
            onClick={() => {
              setOrderSubmitted(false);
              resetFile();
            }}
          >
            Buat Pesanan Baru
          </button>
        </div>
      ) : (
        <div className="checkout-grid">
          {/* Kolom Kiri: Ringkasan Unit Motor */}
          <div className="card">
            <h2 className="card-title">Ringkasan Unit & Sewa</h2>
            <div className="motor-summary">
              <span className="motor-badge">Matic Premium • Free 2 Helm & Jas Hujan</span>
              <h3>Honda Vario 160 ABS</h3>
              <div className="summary-row">
                <span>Harga Sewa / Hari</span>
                <span>Rp {pricePerDay.toLocaleString('id-ID')}</span>
              </div>
              <div className="summary-row">
                <span>Durasi Sewa</span>
                <span>{formData.rentalDays} Hari</span>
              </div>
              <div className="summary-row">
                <span>Lokasi Antar-Jemput</span>
                <span>{formData.deliveryLocation}</span>
              </div>
              <div className="summary-row">
                <span>Status Dokumen Syarat</span>
                <span style={{ color: ktpFile ? '#2a9d8f' : '#e63946', fontWeight: 'bold' }}>
                  {ktpFile ? '✓ KTP Terlampir' : '✕ Belum Unggah KTP'}
                </span>
              </div>
              <div className="summary-total">
                <span>Total Pembayaran</span>
                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form Data Penyewa & Wajib Unggah KTP */}
          <div className="card">
            <h2 className="card-title">Data Penyewa & Validasi KTP</h2>

            <div className="security-notice">
              <strong>Syarat Keamanan Wajib:</strong> Demi keamanan transaksi sewa motor, penyewa wajib mengunggah{' '}
              <strong>foto e-KTP asli</strong> (bukan fotokopi/hasil edit) yang terbaca jelas sebelum pesanan dapat
              dikirim.
            </div>

            <form onSubmit={handleSubmitOrder}>
              <div className="form-group">
                <label htmlFor="fullName">Nama Lengkap (Sesuai KTP) *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-control"
                  placeholder="Contoh: Budi Santoso"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="nik">Nomor Induk Kependudukan (16 Digit NIK) *</label>
                <input
                  type="text"
                  id="nik"
                  name="nik"
                  className="form-control"
                  placeholder="3404xxxxxxxxxxxx"
                  value={formData.nik}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="whatsapp">Nomor WhatsApp Aktif *</label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  className="form-control"
                  placeholder="0812xxxxxxxx"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="rentalDays">Durasi Sewa (Hari)</label>
                <select
                  id="rentalDays"
                  name="rentalDays"
                  className="form-control"
                  value={formData.rentalDays}
                  onChange={(e) => setFormData({ ...formData, rentalDays: Number(e.target.value) })}
                >
                  <option value={1}>1 Hari</option>
                  <option value={2}>2 Hari</option>
                  <option value={3}>3 Hari</option>
                  <option value={4}>4 Hari</option>
                  <option value={5}>5 Hari</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="deliveryLocation">Titik Antar Motor</label>
                <input
                  type="text"
                  id="deliveryLocation"
                  name="deliveryLocation"
                  className="form-control"
                  value={formData.deliveryLocation}
                  onChange={handleInputChange}
                />
              </div>

              {/* Area Upload Dokumen KTP */}
              <div className="form-group">
                <label>Unggah Foto e-KTP Asli *</label>
                <div
                  className={`upload-box ${ktpFile ? 'has-file' : ''} ${ktpError ? 'has-error' : ''}`}
                  onClick={() => !ktpFile && fileInputRef.current.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />

                  {!ktpPreview ? (
                    <div>
                      <span className="upload-icon">🪪</span>
                      <strong>Klik untuk memilih foto KTP asli</strong>
                      <p className="upload-hint">
                        Pastikan foto terang, tidak buram, dan seluruh sudut KTP terlihat (JPG/PNG, Maks. 5MB)
                      </p>
                    </div>
                  ) : (
                    <div className="preview-container">
                      <img src={ktpPreview} alt="Pratinjau KTP Penyewa" className="ktp-preview" />
                      <div>
                        <button
                          type="button"
                          className="btn-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            resetFile();
                          }}
                        >
                          Ganti / Hapus Foto KTP
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {ktpError && <p className="error-text">{ktpError}</p>}
              </div>

              {/* Persetujuan Keaslian Dokumen */}
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="agreement"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                />
                <label htmlFor="agreement">
                  Saya menyatakan bahwa foto KTP yang diunggah adalah dokumen asli milik saya sendiri dan bersedia
                  menunjukkan fisik KTP saat serah terima unit motor.
                </label>
              </div>

              {/* Tombol Submit Terkunci Hingga Syarat Terpenuhi */}
              <button
                type="submit"
                className="btn-submit"
                disabled={!isSecurityValidated || isSubmitting}
              >
                {isSubmitting
                  ? 'Mengunggah Dokumen & Mengirim Pesanan...'
                  : !isSecurityValidated
                  ? 'Lengkapi Data & Unggah KTP untuk Memesan'
                  : 'Kirim Pesanan Sewa Sekarang'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;