import React, { useState } from 'react';
import "./FileForm.css";

const Logo = () => (
    <svg className="icon" x="0px" y="0px" viewBox="0 0 24 24">
        <path fill="transparent" d="M0,0h24v24H0V0z"/>
        <path
            fill="#000"
            d="M20.5,5.2l-1.4-1.7C18.9,3.2,18.5,3,18,3H6C5.5,3,5.1,3.2,4.8,3.5L3.5,5.2C3.2,5.6,3,6,3,6.5V19  c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V6.5C21,6,20.8,5.6,20.5,5.2z M12,17.5L6.5,12H10v-2h4v2h3.5L12,17.5z M5.1,5l0.8-1h12l0.9,1  H5.1z"
        />
    </svg>
);

const FileInfo = ({name, size, type, imageUrl}) => (
    <ul className="preview_info">
        <li>
            <span className="info_key">이름:</span><span className="info_value">{name}</span>
            <span className="info_key">크기:</span><span className="info_value">{size}</span>
            <span className="info_key">타입:</span><span className="info_value">{type}</span>
        </li>
        {imageUrl && <li><img src={imageUrl} alt="Uploaded" className="previw_image"/></li>}
    </ul>

);

const FileForm = () => {
    const [isActive, setActive] = useState(false);
    const [uploadedInfo, setUploadedInfo] = useState(null);

    const handleDragStart = () => setActive(true);
    const handleDragEnd = () => setActive(false);
    const handleDragOver = (event) => event.preventDefault();

    const setFileInfo = (file) => {
        const { name, size: byteSize, type } = file;
        const size = (byteSize / (1024 * 1024)).toFixed(2) + 'MB';
        const isImage = type.includes('image');

        if (!isImage) {
            setUploadedInfo({ name, size, type });
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setUploadedInfo({ name, size, type, imageUrl: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            setFileInfo(file);
        }
        setActive(false);
    };

    const handleUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileInfo(file);
        }
    };

    return (
        <label
            className={`preview${isActive ? ' active' : ''}`}
            onDragEnter={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragEnd}
            onDrop={handleDrop}
        >
            <input type="file" className="file" onChange={handleUpload} />
            {uploadedInfo ? (
                <FileInfo {...uploadedInfo} />
            ) : (
                <>
                    <Logo />
                    <p className="preview_msg">클릭 혹은 파일을 이곳에 드롭하세요.</p>
                    <p className="preview_desc">파일당 최대 3MB</p>
                </>
            )}
        </label>
    );
};

export default FileForm;
