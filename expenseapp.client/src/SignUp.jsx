import { useState } from 'react';
import './SignUp.css'
import { useNavigate } from 'react-router-dom';

function SignUp() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        try {
            const response = await fetch('https://localhost:7172/api/Auth/SignUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*',
                },
                body: JSON.stringify({ email, password, confirmPassword }),
            })

            const data = await response;

            console.log(data);
            
            
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="container">

            <form onSubmit={handleSubmit}>
                <div>
                    <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <input type="password" value={confirmPassword} placeholder="Change Password" onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <button type="submit">Signup</button>
                <p className="text-link">
                    Already have an account? <span onClick={() => navigate('/Login')}>Login here</span>
                </p>
            </form>

        </div>
        
    );
}

export default SignUp;