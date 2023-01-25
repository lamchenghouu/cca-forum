import axios from "axios";
import { SyntheticEvent, useState } from "react"; 
import { Navigate } from "react-router-dom";

const ForgotPassword = () => {

    // collect user input
    const [user_name, setUsername] = useState('');
    const [security_ans, setSecurityAns] = useState('');
    
    // redirection and bottom error msg 
    const [redirect, setRedirect] = useState(false);
    const [err, setErr] = useState('');
    
    // this 'inner' submit button will show before being clicked and will disappear when the user enters an existing user_name
    const [inner_button, setInnerButton] = useState(<button className="w-100 btn btn-lg btn-primary" type="submit">Submit</button>); 
    // this form will appear simultaneously 
    const [outer_form, setOuterForm] = useState(<></>);


    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        // accessing backend
        const {data} = await axios.post('/forgetpassword', {
            user_name
        });
        if (data.response !== "Username exists.") {
            setRedirect(false); 
            setErr(data.response); // "User does not exist."
        } else {
            setErr('');

            // Hides button, displays security question and answer box 
            setInnerButton(<></>);

            setOuterForm(
                <div id="outer_form_show">
                    <p id="security_qns"><b>Please provide an answer for your security question:</b><br/>{data.security_qns}</p>

                    <input type="text" className="form-control" placeholder="Answer" name="name" required onChange={e=>setSecurityAns(e.target.value)}
                    />
                    <div className="littleverticalgap"></div>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
                </div>
            )
        }
    }

    

    const submit2 = async (e: SyntheticEvent) => {
        e.preventDefault();
       
        const {data} = await axios.post('/checksecurityans', {
            user_name,
            security_ans
        });
        console.log(data);
        if (data.response === "Security Answer Wrong.") {
            setErr(data.response);
        } else {
            setRedirect(true);
        }

    }

        
    if (redirect) { 
        return <Navigate to={'/resetpassword'} state={{user_name: user_name}}/>
    }   
    
    return ( 
        <>
        <div className="background-img">
            <main className="form-signin comfortaa">
                <span className="orangetxt">NUS</span> <span className="bluetxt">CCA Forum</span>&ensp;<img className="nus_img" src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/NUS_coat_of_arms.svg/800px-NUS_coat_of_arms.svg.png" width="30" />&emsp;&emsp;&emsp;&ensp;<a type="button" href="/" id="GTP_button" className="btn btn-secondary">Go to Home</a>
                <form onSubmit={submit}>
                    <h5 className="mb-3">Please enter your username</h5>

                    <input type="text" className="form-control" placeholder="Username" required
                        onChange={e=>setUsername(e.target.value)}
                    />

                    <div className="littleverticalgap"></div>
                    {inner_button}
                </form>
                <form onSubmit={submit2} id="outer_form">
                    {/* CSS logic: form and outer_form applied, so outer_form_show must make the fixes */}
                    {outer_form}
                </form>
                <p className="err">{err}</p>
            </main>
        </div></>
    );
};

export default ForgotPassword