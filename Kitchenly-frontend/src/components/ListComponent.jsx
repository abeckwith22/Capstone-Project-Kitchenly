import ListItem from "./ListItem";
import { v4 as uuid } from "uuid";

const ListComponent = ({ items }) => {

    return (
        <>
            <div className="ListComponentContainer">
                <div className="ListComponent">
                    {items.map(i => {
                        return <ListItem key={uuid()} name={i}/>
                    })}
                </div>
            </div>
        </>
    )
}

export default ListComponent;
