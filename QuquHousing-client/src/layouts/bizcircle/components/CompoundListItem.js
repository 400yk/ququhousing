import React from "react";

class CompoundListItem extends React.Component {
    render() {
        return (
            <ul>
                {
                    this.props.CompoundItems.map((item, index) => {
                        return (
                            <li>
                                <label>{item.name}</label>
                            </li>    
                        )
                    })
                }
            </ul>
        )
    }
}

export default CompoundListItem;