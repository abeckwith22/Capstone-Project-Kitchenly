import { useState } from "react";
import { v4 as uuid } from "uuid";

const ListItem = ({ name }) => {
    const [hidden, setHidden] = useState(false);
    return !hidden ? (
        <>
            <div key={uuid()}className="ListItemContainer">
                <div className="ListItem">
                    <h1>{name}</h1>
                </div>
            </div>
        </>
    ) :
    (
        ""
    )
}

export default ListItem; 
