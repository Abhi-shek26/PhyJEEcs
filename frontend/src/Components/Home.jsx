import { useAuthContext } from "../hooks/useAuthContext";

const Home = () => {
    const { user } = useAuthContext();
  return (
    <div>
    <h1>Home</h1>
    <p>Welcome to PhyJEEcs, {user.email}</p>
    </div>
  )
}

export default Home
