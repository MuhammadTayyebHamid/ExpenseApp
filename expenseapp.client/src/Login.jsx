import { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            //const response = await axios.post(, { email, password });

            const response = await fetch('https://localhost:7172/api/Auth/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json();

            const userId = data.userId;

            console.log(data);

            console.log(data.message);
            console.log(userId);

            navigate('/Home', { state: { email, userId } });

        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="container">

            <form onSubmit={handleSubmit}>
                <div>
                    <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
                {
                    <p className="text-link">
                        Don't have an account? <span onClick={() => navigate('/SignUp')} >Sign up here</span>
                    </p>

                }
            </form>
        
        </div>
        
    );


}

export default Login;