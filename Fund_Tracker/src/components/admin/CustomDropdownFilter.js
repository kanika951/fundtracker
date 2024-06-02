import React, { useState } from 'react';

const CustomRadioButtonFilter = ({ column, filterChangedCallback,title }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event) => {
    console.log(event);
    const value = event.target.value;
    setSelectedOption(value);
    filterChangedCallback({
      column,
      filterType: 'equals',
      filter: value,
    });
  };

  return (
    <div>
        <div>{title}</div>
      <label>
        <input
          type="radio"
          value=""
          checked={selectedOption === ''}
          onChange={handleChange}
        />
        All
      </label>
      <br/>
      <label>
        <input
          type="radio"
          value="Accepted"
          checked={selectedOption === "Accepted"}
          onChange={handleChange}
        />
        Accepted
      </label>
      <br/>
      <label>
        <input
          type="radio"
          value="Pending"
          checked={selectedOption === 'Pending'}
          onChange={handleChange}
        />
        Pending
      </label>
      <br/>
      <label>
        <input
          type="radio"
          value="Denied"
          checked={selectedOption === 'Denied'}
          onChange={handleChange}
        />
        Denied
      </label>
      <br/>
    </div>
  );
};

export default CustomRadioButtonFilter;
