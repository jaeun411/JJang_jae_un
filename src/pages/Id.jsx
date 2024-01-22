import React, {useState} from 'react'
import Header from '../components/Header/Header'
import IdForm from "../components/Id/IdForm";

const Id = () => {

    const [userData, setUserData] = useState('');

    const getData=(childValue) =>{
        setUserData(childValue);
    }

    return (
        <>
            <Header />
            <div className='container'>
                <IdForm getdata={getData}/>
            </div>
        </>
    )
}

export default Id