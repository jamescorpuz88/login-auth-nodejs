import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function Login() {
  const navigate = useNavigate();

  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    axios.get('http://localhost:3000/user/login')
      .then((response) => {
        if(response.data.loggedIn) {
          navigate('/home');
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async () => {
    await axios.post('http://localhost:3000/user/login', {
      username: username,
      password: password
    }).then((response) => {
      if (!response.data.auth) {
        // Add logic to display error message
      } else {
        console.log('Login Successful');
        localStorage.setItem('token', response.data.token)
        navigate('/home');
      }
    })
  }

  const handleRegister = async () => {
    await axios.post('http://localhost:3000/user/register', {
      username: usernameReg,
      email: emailReg,
      password: passwordReg
    })
      .then((response) => {
        console.log(response.data.message);
      });
  }

  // const userAuthenticator = async () => {
  //   const requestData = {
  //     headers: {
  //       "x-access-token" : localStorage.getItem('token')
  //     }
  //   }

  //   axios.get('http://localhost:3000/user/isAuth', requestData)
  //     .then((response) => {
  //       console.log(response.data);
  //     })
  // }

  return (
    <div>
      <h1> Login </h1>
      <form>
        <input onChange={(e) => setUsername(e.target.value)}/>
        <input onChange={(e) => setPassword(e.target.value)} type="password"/>
        <button type="button" onClick={handleLogin}>Login</button>
      </form>

      <h1> Register </h1>
      <form>
        <input onChange={(e) => setUsernameReg(e.target.value)}/>
        <input onChange={(e) => setPasswordReg(e.target.value)} type="password"/>
        <input onChange={(e) => setEmailReg(e.target.value)}/>
        <button type="button" onClick={handleRegister}>Register</button>
      </form>
    </div>
  )
}