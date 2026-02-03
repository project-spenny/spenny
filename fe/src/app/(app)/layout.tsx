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
    <div className="flex min-h-dvh flex-col">
      <Header />

      <div className="flex flex-1 flex-col pt-16">
        <Navigation />

        <div className="flex w-full flex-col pb-18 md:pb-0 md:pl-28">
          <main className="flex flex-1 justify-center">{children}</main>
        </div>

        <Toaster />
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
