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

        <div className="flex w-full flex-col md:pl-28">
          <main className="flex flex-1 justify-center">{children}</main>
          <Footer />
        </div>

        <Toaster />
      </div>
    </div>
  );
};

export default AppLayout;
