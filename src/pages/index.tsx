import PongGame from "@/components/Game/PongGame";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import Login from "@/components/Auth/Login";


function Home() {
  // Check authentication here if needed

  return (
    <div>
      <h1>Login Page</h1>
      <Login />
    </div>
  );
}
  export default Home;
  