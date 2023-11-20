import Login from "@/components/Login";
import Navbar from "@/components/Layout/Navbar";
import Header from "@/components/Layout/Header";

function Home() {
  return (
    <div className="w-full m-0 px-28 py-9 min-h-screen relative bg-gradient-to-b from-[#F53FA1] to-[#382A39]">
      <Navbar />
      <Header />
      <h1>Login Page</h1>
      <Login />
    </div>
  );
}
export default Home;
