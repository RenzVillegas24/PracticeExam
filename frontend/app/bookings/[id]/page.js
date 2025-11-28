'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

// Client-side component for date formatting to avoid hydration issues
function MessageItem({ message }) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // Format date on client-side only
    setFormattedDate(new Date(message.created_at).toLocaleString());
  }, [message.created_at]);

  return (
    <div style={{
      background: 'white',
      padding: '12px',
      borderRadius: '4px',
      marginBottom: '10px',
      borderLeft: '3px solid #667eea'
    }}>
      <p style={{ margin: '0 0 4px 0' }}>{message.message}</p>
      <small style={{ color: '#999' }}>
        {formattedDate || 'Loading...'}
      </small>
    </div>
  );
}

export default function BookingDetailPage() {
  const [booking, setBooking] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id;

  useEffect(() => {
    if (!bookingId) return;

    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/');
        return;
      }

      try {
        const [bookingRes, messagesRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/bookings/${bookingId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/messages/${bookingId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ]);

        setBooking(bookingRes.data.booking);
        setMessages(messagesRes.data.messages);
      } catch (err) {
        setError('Failed to load booking details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId, router]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/messages/${bookingId}`,
        { message: messageInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages([...messages, response.data]);
      setMessageInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{
        background: '#333',
        color: 'white',
        padding: '20px 40px'
      }}>
        <Link href="/bookings" style={{ color: 'white', textDecoration: 'none' }}>
          ← Back to Bookings
        </Link>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {booking && (
          <>
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '8px',
              marginBottom: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px' }}>{booking.name}</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <strong>Status:</strong>
                  <p style={{ color: '#667eea', fontSize: '16px' }}>{booking.status}</p>
                </div>
                <div>
                  <strong>Date:</strong>
                  <p style={{ fontSize: '14px' }}>{booking.date}</p>
                </div>
              </div>

              <div>
                <strong>Description:</strong>
                <p style={{ marginTop: '8px', color: '#666', lineHeight: '1.6' }}>
                  {booking.description}
                </p>
              </div>

              {booking.attachments && booking.attachments.length > 0 && (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                  <strong>Attachments:</strong>
                  <div style={{ marginTop: '10px' }}>
                    {booking.attachments.map((att) => (
                      <div key={att.id} style={{ marginBottom: '8px' }}>
                        <a href={att.url} style={{ color: '#667eea' }}>
                          📄 {att.name}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Messages Section */}
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '20px' }}>Messages</h3>

              <div style={{
                background: '#f9f9f9',
                padding: '20px',
                borderRadius: '8px',
                maxHeight: '400px',
                overflowY: 'auto',
                marginBottom: '20px',
                minHeight: '200px'
              }}>
                {messages.length === 0 ? (
                  <p style={{ color: '#999', textAlign: 'center' }}>No messages yet</p>
                ) : (
                  messages.map((msg) => (
                    <MessageItem key={msg.id} message={msg} />
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} style={{
                display: 'flex',
                gap: '10px'
              }}>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Send a message..."
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '12px 20px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Send
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
