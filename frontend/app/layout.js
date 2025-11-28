import './globals.css';

export const metadata = {
  title: 'Customer Portal',
  description: 'Manage your bookings and messages',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <script src="/cache-debug.js"></script>
      </body>
    </html>
  );
}
