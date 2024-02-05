// SnowEffect.jsx
import React from 'react';
import Snowflake from './Snowflake';

const SnowEffect = () => {
    const snowflakes = [];
    const snowflakeCount = 50; // 원하는 눈송이 개수

    for (let i = 0; i < snowflakeCount; i++) {
        const style = {
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${5 + Math.random() * 10}s`, // 5초에서 15초 사이의 지속 시간
            opacity: Math.random(),
            transform: `scale(${Math.random() * 0.5 + 0.5})`, // 0.5에서 1 사이의 크기 조정
            position: 'fixed', // 화면에 고정
            top: '-100px' // 화면 상단 바깥에서 시작
        };
        snowflakes.push(<Snowflake key={i} style={style} />);
    }

    return <div className="snowflakes">{snowflakes}</div>;
};

export default SnowEffect;
