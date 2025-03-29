import { useAuthContext } from "../hooks/useAuthContext";

const Home = () => {
    const { user } = useAuthContext();
  return (
    <div>
    <h1>Home</h1>
    <p>Welcome to PhyJEEcs</p>
    <p>{user.name}</p>
    <p>{user.email}</p>
    <p>{user.year}</p>
    </div>
  )
}

export default Home
