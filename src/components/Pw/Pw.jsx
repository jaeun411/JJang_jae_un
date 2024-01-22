import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import LoginForm from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal'
import * as auth from '../../apis/auth';
import * as Swal from '../../apis/alert';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function PwForm() {
    const navigate = useNavigate()
    const [show, setShow] = useState(false);

    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [email, setEmail] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onPw = async (name, id, email) => {
        console.log(name, id, email);
        let response;

        try{
            response = await auth.pw(name, id, email);
            console.log(`data : ${response.data}`);
            console.log(`status : ${response.status}`);


            Swal.alert("비밀번호 찾기 성공", "Password:"+response.data , "success", () => { navigate("/") })


        }catch(err){
            console.log(err);
        }

    }

    return (
        <>
            <label onClick={handleShow}>
                비밀번호 찾기
            </label>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>비밀번호 찾기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LoginForm>
                        <LoginForm.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <LoginForm.Label>Name</LoginForm.Label>
                            <LoginForm.Control
                                rows={1}
                                value={name}
                                onChange={(e)=> setName(e.target.value)}

                            />
                        </LoginForm.Group>
                        <LoginForm.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <LoginForm.Label>ID</LoginForm.Label>
                            <LoginForm.Control
                                rows={1}
                                value={id}
                                onChange={(e)=>setId(e.target.value)}
                            />
                        </LoginForm.Group>
                        <LoginForm.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <LoginForm.Label>Email address</LoginForm.Label>
                            <LoginForm.Control
                                type="email"
                                placeholder="email@example.com"
                                autoFocus
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                        </LoginForm.Group>
                    </LoginForm>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={()=>onPw(name,id,email)}>
                        Find
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default PwForm;