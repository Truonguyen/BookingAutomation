import React from 'react';

const Dropdown = ({ options }) => {
    return (
        <div>
            <label>Choose an option:</label>
            <select id="dropDown">
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.text}
                    </option>
                ))}
            </select>
        </div>
    )
};

export default Dropdown;