import axios from "axios";
import { SyntheticEvent, useState, useEffect } from "react"; 
import { Navigate } from "react-router-dom";

const EditProfile = () => {

    //  for placeholders 
    const [user_name, setUsername] = useState(''); 
    const [security_qns, setSecurityQns] = useState('');
    const [security_ans, setSecurityAns] = useState('');

    // form controls 
    const [showPW, setShowPW] = useState(false);

    // redirection
    const [redirect, setRedirect] = useState(false);
    const [unauthorised, setUnauthorised] = useState(false);

    useEffect(() => {
        (
            async () => {
      
                const {data} = await axios.get('user'); 
                if (data.response === "You are not allowed to access this page.") {
                    setUnauthorised(true);
                }
                setUsername(data.data.user_name);
                setSecurityQns(data.data.security_qns);


            }
        )()
    }, []);
    
    const toggleShowPW = () => { // will be used to toggle between type="text" and type="password" props for <input> HTML element later on 
        setShowPW(!showPW);
    }

    // submit function (invoked by form submission)
    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        // accessing backend
        const {data} = await axios.put("updateprofile", {
            user_name, 
            security_qns,
            security_ans 
        });
        
        if (data.response === "Profile Updated.") {
            setRedirect(true);
        }
    }

    // redirection 
    if (unauthorised) { 
        return <Navigate to={'/'} state={{nav_msg: "Unable to access profile. Not signed in!"}}/>
    }

    if (redirect) { 
        return <Navigate to={'/'} state={{nav_msg: "Profile Updated!"}}/>
    }
    
    return ( 
        <>
        <div className="background-img">
            <main className="form-signin comfortaa">
                <span className="orangetxt">NUS</span> <span className="bluetxt">CCA Forum</span>&ensp;<img className="nus_img" src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/NUS_coat_of_arms.svg/800px-NUS_coat_of_arms.svg.png" width="30" alt="nus"/>&emsp;&emsp;&emsp;&ensp;<a type="button" href="/" id="GTP_button" className="btn btn-secondary">Go to Home</a>
                <form onSubmit={submit}>
                    <h3 className="mb-3">Update your profile</h3>
                    <div className="squishtxt">Username:</div>
                    <input type="text"  className="form-control" 
                                        defaultValue={user_name} 
                                        required
                                        onChange={e=>setUsername(e.target.value)}
                    />
                    <div className="littleverticalgap"></div>
                    <div className="squishtxt">Security Qns:</div>
                    <input type="text"  className="form-control" 
                                        defaultValue={security_qns} 
                                        required
                                        onChange={e=>setSecurityQns(e.target.value)}
                    />
                    <div className="littleverticalgap"></div>
                    <div className="squishtxt">Security Ans:&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;<input type="checkbox" onClick={toggleShowPW}/> Show Answer</div>
                    <input type={showPW ? "text" : "password"}  
                                        className="form-control"
                                        placeholder="Optional"  
                                        onChange={e=>setSecurityAns(e.target.value)}
                    />
                    <div className="squishtxt">For security purposes, you are unable to view your previous answers.</div>
                    <div className="littleverticalgap"></div>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Update</button>
                    <a href="/forgotpassword">Reset Password</a>
                
                </form>
            </main>
        </div>
        </>
    );
};

export default EditProfile;
