'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function InvoicePage() {
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
  const invoiceDate = new Date();
  const invoiceNumber = `INV-${booking.id.toString().padStart(5, '0')}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with navigation */}
        <div className="mb-8 flex justify-between items-center">
          <Link href={`/bookings/${bookingId}`} className="text-primary font-semibold hover:text-secondary">
            ← Back to Booking
          </Link>
          <button
            onClick={() => window.print()}
            className="btn-primary text-sm"
          >
            Print Invoice
          </button>
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-lg shadow-lg p-12 print:shadow-none">
          {/* Header Section */}
          <div className="border-b-2 border-gray-200 pb-8 mb-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                <p className="text-gray-600 mt-1">Professional Services</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Invoice Number</p>
                <p className="text-lg font-bold text-gray-900">{invoiceNumber}</p>
                <p className="text-sm text-gray-600 mt-3">Invoice Date</p>
                <p className="text-gray-900">{invoiceDate.toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Bill To</p>
                <p className="text-gray-900 font-semibold">Customer Account</p>
                <p className="text-gray-600 text-sm">Service Booking #{booking.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Service Provider</p>
                <p className="text-gray-900 font-semibold">Customer Portal Services</p>
                <p className="text-gray-600 text-sm">Portal Address</p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Service Details</h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="font-semibold text-gray-900 mb-2">{booking.name}</p>
              <p className="text-gray-600 text-sm mb-2">{booking.description}</p>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Date:</span> {booking.date}
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Status:</span> {booking.status}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Qty</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Unit Price</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-900">{booking.name}</td>
                  <td className="py-4 px-4 text-right text-gray-900">1</td>
                  <td className="py-4 px-4 text-right text-gray-900">${baseAmount.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right text-gray-900 font-semibold">${baseAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mb-12">
            <div className="w-full sm:w-80">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between mb-3 pb-3 border-b border-gray-200">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold text-gray-900">${baseAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                  <span className="text-gray-700">Tax (10%):</span>
                  <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between bg-primary text-white p-4 rounded-lg -mx-6 -mb-6 px-6 py-4">
                  <span className="font-bold text-lg">Total Due:</span>
                  <span className="font-bold text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="border-t-2 border-gray-200 pt-8">
            <p className="text-sm font-semibold text-gray-600 uppercase mb-3">Payment Terms</p>
            <p className="text-gray-700 text-sm mb-4">
              Payment is due within 30 days of invoice date. Please reference invoice number on payment.
            </p>
            <p className="text-sm font-semibold text-gray-600 uppercase mb-3">Notes</p>
            <p className="text-gray-700 text-sm">
              Thank you for using our service. If you have any questions about this invoice, please contact us.
            </p>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-xs">
            <p>© 2025 Customer Portal. All rights reserved.</p>
            <p className="mt-2">This is an automatically generated invoice.</p>
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
