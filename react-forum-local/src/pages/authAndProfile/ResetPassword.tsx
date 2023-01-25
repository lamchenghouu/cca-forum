import axios from "axios";
import React, { SyntheticEvent, useEffect, useState } from "react"; 
import { Navigate, useLocation } from "react-router-dom";

const ResetPassword = () => {

    // collect user input
    const [user_name, setUsername] = useState('');
    const [new_password, setNewPassword] = useState('');
    // redirection & error
    const [redirect, setRedirect] = useState(false);
    const [unauthorised, setUnauthorised] = useState(false);
    const [err, setErr] = useState('');
    const location = useLocation(); // get nav_msg 

    useEffect(() => {  // we can use the other block access method, but just because we are passing a user_name value we can do this. but there might be security risks
    // here, we are passing a user_name via <Navigate /> from ForgotPassword.tsx, we use this to ensure that there is an existing username being passed. if not, it will triggera an error which we catch here 
        (
          async () => {
            
            try {
                setUsername(location.state.user_name);
            } catch(e) {
                setUnauthorised(true);
            }
         
          }
        )()
    }, [user_name]); 
    
    if (unauthorised) {
        return <Navigate to={'/'} state={{nav_msg: "You tried to access a restricted page. Access denied."}}/>
    } 

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        // accessing backend
        const {data} = await axios.post('/resetpassword', {
            user_name: location.state.user_name,
            new_password
        });

        if (data.response !== "Password Updated Successfully.") {
            setRedirect(false); 
            setErr(data.response);
        } else {
            setRedirect(true);    
        }
    }
        
    if (redirect) { 
        return <Navigate to={'/'}  state={{nav_msg: "Password changed successfully."}}/>
    }
    
    return ( 
        <>
        <div className="background-img">
            <main className="form-signin comfortaa">
                <span className="orangetxt">NUS</span> <span className="bluetxt">CCA Forum</span>&ensp;<img className="nus_img" src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/NUS_coat_of_arms.svg/800px-NUS_coat_of_arms.svg.png" width="30" />&emsp;&emsp;&emsp;&ensp;<a type="button" href="/" id="GTP_button" className="btn btn-secondary">Go to Home</a>

                <form onSubmit={submit}>
                    <h3 className="mb-3">Hi {user_name}, enter your new password</h3>

                    <input type="password" className="form-control" placeholder="Password" required
                        onChange={e=>setNewPassword(e.target.value)}
                    
                    />
                    
                    <div className="littleverticalgap"></div>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
                </form>
                <p className="err">{err}</p>
            </main>
        </div></>
    );
};

export default ResetPassword