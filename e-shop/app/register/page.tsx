import Container from "../components/Container";
import FormWrap from "../components/FormWrap";
import RegisterForm from "./RegisterForm";

const Register = () => {
    return ( 
    <Container>
        <FormWrap>
            <RegisterForm></RegisterForm>
        </FormWrap>
    </Container> 
    );
}
 
export default Register;