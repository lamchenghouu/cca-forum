import Structure from "../../components/Structure";

const About = () => {
        return (
            <Structure>
                <br /><br /><br />
                <h1 className="welcome_msg">About this Project</h1>
                <p className="welcome_desc">
                    Hi, I'm Cheng Hou, the developer of this webapp project. I learned the basics of Golang, React & Typescript in the span of less than a month, in order to successfully develop this forum for the pre-CVWO assignment. I have learned so much in this 1 month, from setting up a connection to MySQL to designing quite decent-looking UI. I hope to learn so much more from this 3-month internship which is taking place across the summer. My other programming interests are SwiftUI, Python & Flask.<br/><br/>
                    During my stint at CVWO, I hope to develop robustly useful software for the community, or those serving the community. I also hope to further develop this web development skillset as I found it very fulfilling and intersting. Furthermore, I aim to develop something for NUS while I'm here :)
                </p>

                <h1 className="welcome_msg">Updates</h1>
                <p className="welcome_desc">
                    I will continue updating this project with new features, to serve as a repository of web development techniques. Below are the list of features I intend to implement over the next few months leading up to CVWO: 
                </p>    
                <ul className="welcome_desc">
                    <li>&emsp;Advanced search engine</li>
                    <li>&emsp;AI integration to suggest posts based on user activity</li>
                    <li>&emsp;EULA, PDPA compliance</li>
                    <li>&emsp;Light/Dark Mode</li>
                    <li>&emsp;Email Authentication</li>
                    <li>&emsp;Markdown guide</li>
                </ul>
                <p className="welcome_desc">
                    Please also do suggest some features here for me to implement: 
                </p>
                 
            </Structure>
        );
}
 

export default About; 