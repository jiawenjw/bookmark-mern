import React from 'react'
import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Searchbar = ({search_bookmark}) => {
    const [search_input, setSearch_input] = useState("")
    

    return (
        <div className="searchbar">
            
            <div className="dropdown">
                <input type="text" className="searchbar_input" value={search_input} onChange={(e) => setSearch_input(e.target.value)} placeholder="enter your search" />
                {/* <ul className="dropdown_list">
                    <li className="row_wrap">history1</li>
                    <li className="row_wrap">history2</li> 
                    <li className="row_wrap">history1</li>
                    <li className="row_wrap">history1</li>
                    <li className="row_wrap">history2</li> 
                    <li className="row_wrap">history1</li>
                </ul> */}
            </div>
            <button className="searchbar_submit" onClick={() => search_bookmark(search_input)}><FontAwesomeIcon icon="search" /></button>
           
        </div>
    )
}

export default Searchbar
