import React from 'react';

class Input extends React.Component {
    render(){
        const {title, update, value} = this.props
        return <>
            <span>{title}</span>
            <input type="text"
                value={value}
                onChange={event => update(event.target.value)}
                style={{width: 200, height: 40, fontSize: '2em'}}
            />
        </>
    }
}

export default Input;
