import Navbar from '@/components/Navbar';
import UserForm from '../Components/UserForm'

export default function Login() {
    return (
        <>
            <Navbar></Navbar>
            <UserForm pageType="Login"></UserForm>
        </>
    );
}
