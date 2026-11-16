import React, { useState } from 'react';
import {
  Bike,
  Calendar,
  Clock,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  FileText,
  MessageCircle,
  X,
  PlusCircle
} from 'lucide-react';
import './app.css';

// Data simulasi pesanan pelanggan (disesuaikan dengan konteks AY Rental Motor Jogja)
const INITIAL_ORDERS = [
  {
    id: 'AYR-20261118-01',
    motorName: 'Yamaha NMAX 155 Connected',
    plateNumber: 'AB 4521 XY',
    category: 'Matic Maxi',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80',
    pickupDate: '18 Nov 2026, 09:00 WIB',
    returnDate: '20 Nov 2026, 09:00 WIB',
    durationDays: 2,
    pickupLocation: 'Stasiun Tugu Yogyakarta (Antar Gratis)',
    facilities: '2 Helm SNI, 2 Jas Hujan, Phone Holder',
    totalPrice: 280000,
    status: 'pending', // pending | approved | completed
    statusNote: 'Menunggu verifikasi KTP/SIM C dan konfirmasi pembayaran oleh admin.'
  },
  {
    id: 'AYR-20261122-04',
    motorName: 'Honda Vario 160 ABS',
    plateNumber: 'AB 2910 KQ',
    category: 'Matic 160cc',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=400&q=80',
    pickupDate: '22 Nov 2026, 13:00 WIB',
    returnDate: '25 Nov 2026, 13:00 WIB',
    durationDays: 3,
    pickupLocation: 'Garasi Utama AY Rental (Jl. Kaliurang)',
    facilities: '2 Helm SNI, 2 Jas Hujan',
    totalPrice: 360000,
    status: 'approved',
    statusNote: 'Pesanan disetujui! Unit siap diambil/diantar sesuai jadwal.'
  },
  {
    id: 'AYR-20261010-09',
    motorName: 'Honda Beat Street LED',
    plateNumber: 'AB 6112 ZP',
    category: 'Matic Compact',
    image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=400&q=80',
    pickupDate: '10 Okt 2026, 08:00 WIB',
    returnDate: '12 Okt 2026, 08:00 WIB',
    durationDays: 2,
    pickupLocation: 'Stasiun Lempuyangan',
    facilities: '2 Helm SNI, 1 Jas Hujan',
    totalPrice: 170000,
    status: 'completed',
    statusNote: 'Unit telah dikembalikan dalam kondisi baik. Terima kasih!'
  }
];

const USER_PROFILE = {
  name: 'Raka Pratama',
  initials: 'RP',
  email: 'raka.pratama@email.com',
  phone: '+62 812-3456-7890',
  city: 'Yogyakarta, Indonesia',
  verified: true
};

export default function App() {
  const [orders] = useState(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming | pending | approved | completed | all
  const [selectedOrder, setSelectedOrder] = useState(null);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="status-badge status-pending">
            <Clock size={14} /> Pending (Menunggu Konfirmasi)
          </span>
        );
      case 'approved':
        return (
          <span className="status-badge status-approved">
            <CheckCircle2 size={14} /> Approved (Disetujui)
          </span>
        );
      case 'completed':
        return (
          <span className="status-badge status-completed">
            <ShieldCheck size={14} /> Selesai
          </span>
        );
      default:
        return null;
    }
  };

  // Filter pesanan berdasarkan tab aktif
  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'upcoming') {
      return order.status === 'pending' || order.status === 'approved';
    }
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  // Hitung jumlah untuk badge tab
  const counts = {
    upcoming: orders.filter((o) => o.status === 'pending' || o.status === 'approved').length,
    pending: orders.filter((o) => o.status === 'pending').length,
    approved: orders.filter((o) => o.status === 'approved').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    all: orders.length
  };

  return (
    <div>
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <a href="#top" className="brand-logo">
            <Bike size={26} color="#f97316" />
            AY<span>RentalMotor</span>
          </a>
          <a href="#sewa-baru" className="btn btn-primary">
            <PlusCircle size={16} /> Sewa Motor Lagi
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="profile-wrapper">
        {/* Sidebar: Profil Pelanggan */}
        <aside className="profile-card">
          <div className="profile-header">
            <div className="avatar-circle">{USER_PROFILE.initials}</div>
            <h2 className="profile-name">{USER_PROFILE.name}</h2>
            {USER_PROFILE.verified && (
              <span className="profile-badge">
                <ShieldCheck size={14} /> Identitas & SIM C Terverifikasi
              </span>
            )}
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <Mail size={16} />
              <span>{USER_PROFILE.email}</span>
            </div>
            <div className="detail-item">
              <Phone size={16} />
              <span>{USER_PROFILE.phone}</span>
            </div>
            <div className="detail-item">
              <MapPin size={16} />
              <span>{USER_PROFILE.city}</span>
            </div>
          </div>
        </aside>

        {/* Right Panel: Riwayat & Pemantauan Pesanan */}
        <section className="orders-section">
          <div className="section-header">
            <div>
              <h1 className="section-title">Riwayat & Status Pesanan</h1>
              <p className="section-subtitle">
                Pantau jadwal sewa motor mendatang, persetujuan admin, dan riwayat selesai.
              </p>
            </div>
          </div>

          {/* Tab Filter Status */}
          <div className="filter-tabs" role="tablist">
            <button
              className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Mendatang <span className="tab-count">{counts.upcoming}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending <span className="tab-count">{counts.pending}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
              onClick={() => setActiveTab('approved')}
            >
              Approved <span className="tab-count">{counts.approved}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Selesai <span className="tab-count">{counts.completed}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Semua <span className="tab-count">{counts.all}</span>
            </button>
          </div>

          {/* Daftar Kartu Pesanan */}
          <div className="orders-list">
            {filteredOrders.length === 0 ? (
              <div className="empty-state">
                <p>Tidak ada pesanan pada kategori status ini.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <article key={order.id} className="order-card">
                  <div className="order-top">
                    <div className="order-id">
                      Kode Booking: <span>{order.id}</span>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="order-body">
                    <img
                      src={order.image}
                      alt={order.motorName}
                      className="motor-img"
                    />
                    <div className="motor-info">
                      <h3>{order.motorName}</h3>
                      <div className="meta-grid">
                        <span className="meta-item">
                          <Calendar size={14} /> {order.pickupDate} ({order.durationDays} Hari)
                        </span>
                        <span className="meta-item">
                          <MapPin size={14} /> {order.pickupLocation}
                        </span>
                      </div>
                    </div>
                    <div className="order-price-box">
                      <div className="price-label">Total Sewa</div>
                      <div className="price-value">{formatRupiah(order.totalPrice)}</div>
                    </div>
                  </div>

                  <div className="order-footer">
                    <p className="status-note">{order.statusNote}</p>
                    <div className="action-group">
                      <button
                        className="btn btn-outline"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <FileText size={15} /> Detail Booking
                      </button>
                      {order.status !== 'completed' && (
                        <a
                          href={`https://wa.me/6281234567890?text=Halo%20Admin%20AY%20Rental%20Motor,%20saya%20ingin%20konfirmasi%20pesanan%20${order.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary"
                        >
                          <MessageCircle size={15} /> Hubungi Admin
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Modal Detail Booking */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Rincian Pemesanan</h3>
              <button
                className="btn btn-outline"
                style={{ padding: '0.35rem' }}
                onClick={() => setSelectedOrder(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              {getStatusBadge(selectedOrder.status)}
            </div>

            <div className="modal-row">
              <span>Kode Booking</span>
              <span>{selectedOrder.id}</span>
            </div>
            <div className="modal-row">
              <span>Unit Motor</span>
              <span>{selectedOrder.motorName}</span>
            </div>
            <div className="modal-row">
              <span>Nomor Polisi</span>
              <span>{selectedOrder.plateNumber}</span>
            </div>
            <div className="modal-row">
              <span>Waktu Pengambilan</span>
              <span>{selectedOrder.pickupDate}</span>
            </div>
            <div className="modal-row">
              <span>Waktu Pengembalian</span>
              <span>{selectedOrder.returnDate}</span>
            </div>
            <div className="modal-row">
              <span>Lokasi Serah Terima</span>
              <span>{selectedOrder.pickupLocation}</span>
            </div>
            <div className="modal-row">
              <span>Fasilitas Termasuk</span>
              <span>{selectedOrder.facilities}</span>
            </div>
            <div className="modal-row" style={{ borderBottom: 'none', paddingTop: '0.85rem' }}>
              <span>Total Pembayaran</span>
              <span style={{ fontSize: '1.05rem', color: '#f97316' }}>
                {formatRupiah(selectedOrder.totalPrice)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}