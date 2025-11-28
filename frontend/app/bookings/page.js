'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/');
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/bookings`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setBookings(response.data.bookings);
      } catch (err) {
        setError('Failed to load bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{
        background: '#333',
        color: 'white',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1>Customer Portal</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ marginBottom: '30px' }}>Your Bookings</h2>

        {loading && <p>Loading bookings...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && bookings.length === 0 && (
          <p style={{ color: '#666' }}>No bookings found.</p>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {bookings.map((booking) => (
            <Link key={booking.id} href={`/bookings/${booking.id}`}>
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                textDecoration: 'none',
                color: 'inherit'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}>
                <h3 style={{ marginBottom: '10px', color: '#333' }}>{booking.name}</h3>
                <p style={{ marginBottom: '8px', color: '#666', fontSize: '14px' }}>
                  <strong>Status:</strong> {booking.status}
                </p>
                <p style={{ marginBottom: '8px', color: '#666', fontSize: '14px' }}>
                  <strong>Date:</strong> {booking.date}
                </p>
                <p style={{ color: '#999', fontSize: '13px' }}>{booking.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
