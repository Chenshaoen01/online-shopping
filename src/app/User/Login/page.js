import Navbar from '@/components/Navbar';
import UserForm from '../Components/UserForm'

export const metadata = {
    title: "會員登入"
};

export default function Login() {
    return (
        <>
            <Navbar></Navbar>
            <UserForm pageType="Login"></UserForm>
        </>
    );
}
