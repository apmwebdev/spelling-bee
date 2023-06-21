import React from 'react';
// import PropTypes from 'prop-types';

const Words = props => {
  return (
    <div>
      <h1>Words</h1>
      {props.words.map(word => {
        return <div key={word.id}>
          <h2>{word.word}</h2>
        </div>
      })}
    </div>
  );
};

// Words.propTypes = {
//
// };

export default Words;