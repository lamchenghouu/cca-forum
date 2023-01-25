import React, { useEffect, useState } from "react"; 
import axios from "axios";
import Structure from "../../components/Structure";

// Displays tag with the most popular tag (by likes) on top

const TagList = () => {

    const [tagData, setTagData] = useState([['', '']]); 

    useEffect(() => {    
        (
        async () => {
            
            const {data} = await axios.get(`populartags`);
            setTagData(data.data);

        }
        )()
    }, []);

    return (
        <Structure>
            <br /><br /><br />
            <h1 className="welcome_msg">Tags</h1>
            <p className="welcome_desc">
                Trending tags are displayed at the top~
            </p>
        
            <table id="tag-table">
                <thead className="bluetxt comfortaa">
                    <th>Tag (Total Likes)</th>
                </thead>
                
                <tbody className="scrollablespace2">
                    
                    {tagData.map((t) => {
                        return (
                            <a href={`/posts/tag/${t[0]}/0`} className="tag-table-disable-deco">
                                <tr className="orangetxt comfortaa">
                                    <td>{t[0]}</td>
                                    <td>{t[1]}</td>
                                </tr>
                            </a>
                        )
                    })}

                </tbody>
            </table>
        

            
        </Structure>
    );
}
 
export default TagList; 