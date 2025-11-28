'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function ReceiptPage() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id;

  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/');
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/bookings/${bookingId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBooking(response.data.booking);
      } catch (err) {
        setError('Failed to load booking');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Booking not found'}</p>
          <Link href="/bookings" className="text-primary hover:underline mt-4 inline-block">
            Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  // Sample pricing calculation
  const baseAmount = 150;
  const taxRate = 0.1;
  const tax = baseAmount * taxRate;
  const total = baseAmount + tax;
  const receiptDate = new Date();
  const receiptNumber = `REC-${booking.id.toString().padStart(5, '0')}`;
  const transactionId = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const confirmationCode = `CONF-${booking.id.toString().padStart(5, '0')}-${new Date().getFullYear()}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header with navigation */}
        <div className="mb-8 flex justify-between items-center">
          <Link href={`/bookings/${bookingId}`} className="text-primary font-semibold hover:text-secondary">
            ← Back to Booking
          </Link>
          <button
            onClick={() => window.print()}
            className="btn-primary text-sm"
          >
            Print Receipt
          </button>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none max-w-2xl mx-auto">
          {/* Success Badge */}
          <div className="text-center mb-8 pb-8 border-b-2 border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <span className="text-3xl text-green-600">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Received</h1>
            <p className="text-gray-600">Thank you for your payment</p>
          </div>

          {/* Receipt Numbers */}
          <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Receipt Number</p>
              <p className="text-lg font-bold text-gray-900">{receiptNumber}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Receipt Date</p>
              <p className="text-lg font-bold text-gray-900">{receiptDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Transaction ID</p>
              <p className="text-lg font-bold text-gray-900 font-mono">{transactionId}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Confirmation</p>
              <p className="text-lg font-bold text-gray-900 font-mono">{confirmationCode}</p>
            </div>
          </div>

          {/* Service Information */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Service Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700 font-semibold">Service:</span>
                <span className="text-gray-900">{booking.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-semibold">Date:</span>
                <span className="text-gray-900">{booking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-semibold">Booking ID:</span>
                <span className="text-gray-900 font-mono">{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-semibold">Status:</span>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  {booking.status}
                </span>
              </div>
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Amount</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Service Charge:</span>
                <span>${baseAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 pb-3 border-b border-gray-200">
                <span>Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 bg-primary text-white p-4 rounded-lg">
                <span>Total Paid:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Payment Method</h2>
            <p className="text-gray-700">Credit Card</p>
            <p className="text-gray-600 text-sm">Ending in ****</p>
          </div>

          {/* Terms and Notes */}
          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">✓</span> This payment has been successfully processed and recorded in our system.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">✓</span> A confirmation email has been sent to your registered email address.
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">✓</span> Please keep this receipt for your records.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 no-print">
            <Link
              href={`/bookings/${bookingId}`}
              className="flex-1 btn-primary text-center"
            >
              Back to Booking
            </Link>
            <Link
              href={`/bookings/${bookingId}/invoice`}
              className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold transition-colors text-center"
            >
              View Invoice
            </Link>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-xs">
            <p>© 2025 Customer Portal. All rights reserved.</p>
            <p className="mt-2">This is an automatically generated receipt.</p>
            <p className="mt-2 text-gray-400">
              For support, contact support@customerportal.com
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            background: white;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
