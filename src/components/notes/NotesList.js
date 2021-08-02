import React from "react";


const notesList=(props)=>{
    return(
        <ul className="notes-list">
            {props.children}
        </ul>
    )
    
}

export default notesList;