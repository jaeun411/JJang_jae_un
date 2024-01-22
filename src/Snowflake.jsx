// Snowflake.jsx
import React from 'react';
import './Snowflake.css'; // 별도로 스타일을 정의한 CSS 파일

const Snowflake = ({ style }) => {
    return <div className="snowflake" style={style}>{"\u2745"}</div>;
};

export default Snowflake;
