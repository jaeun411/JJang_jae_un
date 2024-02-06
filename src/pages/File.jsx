import React from 'react'
import Header from '../components/Header/Header'
import FileForm from '../components/FileUpload/FileForm'

const File = () => {
    return (
        <>
            <Header />
            <div className='container'>
                <FileForm />
            </div>
        </>
    )
}

export default File