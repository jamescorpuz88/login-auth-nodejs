import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/user/login')
      .then((response) => {
        if(!response.data.loggedIn) {
          navigate('/');
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogout = async () => {
    await axios.get('http://localhost:3000/user/logout')
      .then((response) => {
        console.log(response.data.message);
        navigate('/');
      });
  }

  return (
    <div>
      <h1>Home</h1>
      <button type="button" onClick={handleLogout}> Logout </button>
    </div>
  );
}