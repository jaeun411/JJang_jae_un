import react, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import LoginForm from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal'
import 'bootstrap/dist/css/bootstrap.min.css';
import * as auth from '../../apis/auth';
import * as Swal from '../../apis/alert';
import { useNavigate } from 'react-router-dom';


const IdForm = ()=> {
    const [show, setShow] = useState(false);
    const[name,setName] = useState('');
    const[email,setEmail] = useState('');
    // const[loginId, setLoginId] = useState('');

    const navigate = useNavigate()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onId =async(username,email) => {
        console.log(username, email);
        let response;
        let loginId;
        try{
            response = await auth.id(username, email);
            console.log(`data : ${response.data}`);
            console.log(`status : ${response.status}`);
            loginId= response.data;
            console.log(`loginid : ${loginId}`);

            Swal.alert("아이디 찾기 성공", "ID:"+loginId , "success", () => { navigate("/") })


        }catch{
            console.log('error');
        }
    };

    return (
        <>
            <label onClick={handleShow}>
                아이디 찾기 |
            </label>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>아이디 찾기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LoginForm>
                        <LoginForm.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <LoginForm.Label>Name</LoginForm.Label>
                            <LoginForm.Control
                                as="textarea"
                                rows={1}
                                value={name}
                                onChange={(e)=>{setName(e.target.value)}}
                            />
                        </LoginForm.Group>

                        <LoginForm.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <LoginForm.Label>Email address</LoginForm.Label>
                            <LoginForm.Control
                                type="email"
                                placeholder="email@example.com"
                                autoFocus
                                value={email}
                                onChange={(e)=>{setEmail(e.target.value)}}
                            />
                        </LoginForm.Group>
                    </LoginForm>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={()=>onId(name,email)}>
                        {/* <InfoForm loginId={loginId} /> */}
                        Find
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default IdForm;