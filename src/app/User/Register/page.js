import Navbar from '@/components/Navbar';
import UserForm from '@/components/UserForm'

export default () => {
    return (
        <>
            <Navbar></Navbar>
            <UserForm pageType="Register"></UserForm>
        </>
    );
}