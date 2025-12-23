import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Navigation from "@/components/layout/Navigation";

const AppLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
        
            <div className="pt-16 flex flex-1 flex-col md:flex-row">
                <Navigation/>
                <main className="flex-1 flex justify-center items-center md:pl-28">{children}</main>
            </div>

            <Footer/>
        </div>
    )
}

export default AppLayout