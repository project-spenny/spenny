import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Toaster } from 'sonner';
const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex flex-1 flex-col pt-16 md:flex-row">
        <Navigation />
        <main className="flex flex-1 items-center justify-center md:pl-28">
          {children}
        </main>
        <Toaster />
      </div>

      <Footer />
    </div>
  );
};

export default AppLayout;
