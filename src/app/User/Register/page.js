import Navbar from '@/components/Navbar';
import UserForm from '../Components/UserForm'

export default function RegisterPage() {
    return (
        <>
            <Navbar></Navbar>
            <UserForm pageType="Register"></UserForm>
        </>
    );
}