'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { BookingDetailSkeleton } from '../../components/SkeletonLoading';

// Memoized MessageItem to prevent unnecessary re-renders
const MessageItem = ({ message }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(new Date(message.created_at).toLocaleString());
  }, [message.created_at]);

  return (
    <div className="bg-white p-4 rounded-lg border-l-4 border-primary mb-3 hover:shadow-md transition-shadow">
      <p className="text-gray-800 font-medium">{message.message}</p>
      <p className="text-xs text-gray-400 mt-2">
        {formattedDate || 'Loading...'}
      </p>
    </div>
  );
};

export default function BookingDetailPage() {
  const [booking, setBooking] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id;

  // Fetch data function - memoized to prevent function recreation
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/');
      return;
    }

    try {
      setLoading(true);
      // Parallel requests for better performance
      const [bookingRes, messagesRes] = await Promise.all([
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/bookings/${bookingId}`,
          { 
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000 // 10 second timeout
          }
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/messages/${bookingId}`,
          { 
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000 // 10 second timeout
          }
        )
      ]);

      setBooking(bookingRes.data.booking);
      setMessages(messagesRes.data.messages);
      setError('');
    } catch (err) {
      setError('Failed to load booking details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [bookingId, router]);

  useEffect(() => {
    if (!bookingId) return;
    fetchData();
  }, [bookingId, fetchData]);

  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || sendingMessage) return;

    const token = localStorage.getItem('authToken');
    setSendingMessage(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/messages/${bookingId}`,
        { message: messageInput },
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000 // 5 second timeout
        }
      );

      setMessages([...messages, response.data]);
      setMessageInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSendingMessage(false);
    }
  }, [messageInput, bookingId, messages, sendingMessage]);

  if (loading) {
    return <BookingDetailSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/bookings" className="text-primary font-semibold hover:text-secondary flex items-center gap-2">
            ← Back to Bookings
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {booking && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <div className="card p-8">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{booking.name}</h1>
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
                      <p className="text-lg font-bold text-primary mt-1">{booking.status}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{booking.date}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</p>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {booking.description}
                  </p>
                </div>

                {/* Attachments */}
                {booking.attachments && booking.attachments.length > 0 && (
                  <div className="border-t border-gray-200 mt-6 pt-6">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Attachments</p>
                    <div className="space-y-2">
                      {booking.attachments.map((att) => (
                        <a
                          key={att.id}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                        >
                          <span className="text-lg">📄</span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800 group-hover:text-primary">{att.name}</p>
                            <p className="text-xs text-gray-500">Click to view</p>
                          </div>
                          <span className="text-primary group-hover:text-secondary">→</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-6 h-full flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>

                {/* Messages List */}
                <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto max-h-96 space-y-2">
                  {messages.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-8">
                      No messages yet. Start a conversation!
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <MessageItem key={msg.id} message={msg} />
                    ))
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="input-field text-sm"
                    disabled={sendingMessage}
                  />
                  <button
                    type="submit"
                    className="btn-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={sendingMessage}
                  >
                    {sendingMessage ? 'Sending...' : 'Send'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
