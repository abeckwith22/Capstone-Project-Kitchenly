import { useState } from "react";

const ListItem = ({ name }) => {
    const [hidden, setHidden] = useState(false);
    return !hidden ? (
        <>
            <div className="ListItemContainer">
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
