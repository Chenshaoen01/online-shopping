import Navbar from '@/components/Navbar';
import UserForm from '../Components/UserForm'

export const metadata = {
    title: "會員註冊"
};

export default function RegisterPage() {
    return (
        <>
            <Navbar></Navbar>
            <UserForm pageType="Register"></UserForm>
        </>
    );
}