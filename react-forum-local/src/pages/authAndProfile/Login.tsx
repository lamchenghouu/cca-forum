import axios from "axios";
import { SyntheticEvent, useState } from "react"; 
import { Navigate } from "react-router-dom";

const Login = () => {

    // collect user input 
    const [user_name, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false); // facilitate redirection after submission
    const [err, setErr] = useState(''); // red error msg at bottom 
    const [showPW, setShowPW] = useState(false); // password toggle feature 

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault(); // for forms 
        // accessing backend
        const {data} = await axios.post("login", {
            user_name, 
            password 
        })
        
        if (data.response !== "Login completed.") {
            setErr(data.response);
        } else {
            setRedirect(true);
        }
    }

    const toggleShowPW = () => {
        setShowPW(!showPW);
    }

    if (redirect) { 
        return <Navigate to={'/'}/>
    }
    
    return ( 
        <>
        <div className="background-img">
            <main className="form-signin comfortaa">
                <span className="orangetxt">NUS</span> <span className="bluetxt">CCA Forum</span>&ensp;<img className="nus_img" src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/NUS_coat_of_arms.svg/800px-NUS_coat_of_arms.svg.png" width="30" />
                &emsp;&emsp;&emsp;&ensp;
                
                <a type="button" href="/" id="GTP_button" className="btn btn-secondary">Go to Home</a>
                
                <form onSubmit={submit}>
                    <h3 className="mb-3">Please login</h3>

                    <input type="text" className="form-control" placeholder="Username" required
                        onChange={e=>setUsername(e.target.value)}
                    />

                    <div className="littleverticalgap"></div>
                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;
                    
                    <input type="checkbox" onClick={toggleShowPW}/>Show Password
                    <input type={showPW ? "text" : "password"} className="form-control" 
                           placeholder="Password" required
                           onChange={e=>setPassword(e.target.value)} />

                    <div className="littleverticalgap"></div>
                    <button className="w-100 btn btn-lg btn-primary" 
                            type="submit">Submit
                    </button>

                    <div className="littleverticalgap"></div>

                    <a className="blue-txt2" href="/forgotpassword">Forget Password?</a>
                </form>
                <p className="err">{err}</p>
            </main>
        </div></>
    );
};

export default Login;
