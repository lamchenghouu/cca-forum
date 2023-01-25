import axios from "axios";
import { SyntheticEvent, useState } from "react"; 
import { Navigate } from "react-router-dom";
// note: default URL has been set and withCredentials has been set to true in index.tsx

const Register = () => {
    
    // collect user input 
    const [user_name, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setCfmPassword] = useState('');
    const [security_qns, setSecurityQns] = useState(''); 
    const [security_ans, setSecurityAns] = useState('');
    const [showPW, setShowPW] = useState(false); // show PW toggle feature 
    // redirection and error msg 
    const [redirect, setRedirect] = useState(false);
    const [err, setErr] = useState('');
    
    
    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        // accessing backend
        const {data} = await axios.post("register", {
            user_name, // i.e. user_name: user_name
            password, 
            confirm_password, 
            security_qns,
            security_ans // no need for ','           
        })

        if (data.response !== "Registration completed.") {
            setErr(data.response);
        } else {
            setRedirect(true);
        }
    }

    const toggleShowPW = () => {
        setShowPW(!showPW);
    }

    if (redirect) { 
        return <Navigate to={'/'} state={{nav_msg: "Successfully registered. Please login."}}/>
    }
    
    return ( 
        <>
        <div className="background-img">
            <main className="form-signin comfortaa" id="regshiftupoverride">
                <span className="orangetxt">NUS</span> <span className="bluetxt">CCA Forum</span>&ensp;<img className="nus_img" src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/NUS_coat_of_arms.svg/800px-NUS_coat_of_arms.svg.png" width="30" />&emsp;&emsp;&emsp;&ensp;<a type="button" href="/" id="GTP_button" className="btn btn-secondary">Go to Home</a>
                <form onSubmit={submit}>
                    <h3 className="mb-3">Please register</h3>

                    <input type="text" className="form-control" placeholder="Username (length 4-20)" required
                        onChange={e=>setUsername(e.target.value)}
                    />

                    <div className="littleverticalgap"></div>
                    <input type={showPW ? "text" : "password"} className="form-control" placeholder="Password (length 8-20)" required
                        onChange={e=>setPassword(e.target.value)}
                    />

                    <div className="littleverticalgap"></div>
                    <input type={showPW ? "text" : "password"} className="form-control" placeholder="Confirm Password" required
                        onChange={e=>setCfmPassword(e.target.value)}
                    />

                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;
                    <input type="checkbox" onClick={toggleShowPW}/>Show Password
                    <input type="text" className="form-control" placeholder="Security Question" required
                        onChange={e=>setSecurityQns(e.target.value)}
                    
                    />

                    <div className="littleverticalgap"></div>
                    <input type="text" className="form-control" placeholder="Security Answer" required
                        onChange={e=>setSecurityAns(e.target.value)}
                    
                    />

                    <div className="littleverticalgap"></div>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
                </form>
                <p className="err">{err}</p>
            </main>
        </div></>
    );
};

export default Register;
