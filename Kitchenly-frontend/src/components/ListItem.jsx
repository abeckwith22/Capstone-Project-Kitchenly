import { useState } from "react";
import { v4 as uuid } from "uuid";

const ListItem = ({ handleRemove, name, type }) => {
    const [hidden, setHidden] = useState(false);
    return !hidden ? (
        <>
            <div onClick={() => handleRemove(name, type)} key={uuid()}className="ListItemContainer">
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
