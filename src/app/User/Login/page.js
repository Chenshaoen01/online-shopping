import Navbar from '@/components/Navbar';
import UserForm from '@/components/UserForm'

export default function Login() {
    return (
        <>
            <Navbar></Navbar>
            <UserForm pageType="Login"></UserForm>
        </>
    );
}
