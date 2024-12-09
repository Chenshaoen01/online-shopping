import Navbar from '@/components/Navbar';
import UserForm from '../Components/UserForm'

export default () => {
    return (
        <>
            <Navbar></Navbar>
            <UserForm pageType="Register"></UserForm>
        </>
    );
}