import ListItem from "./ListItem";
import { v4 as uuid } from "uuid";

const ListComponent = ({ items, type, handleRemove }) => {

    return (
        <>
            <div className="ListComponentContainer">
                <div className="ListComponent">
                    {items.map(i => {
                        return <ListItem key={uuid()} handleRemove={handleRemove} name={i} type={type}/>
                    })}
                </div>
            </div>
        </>
    )
}

export default ListComponent;
