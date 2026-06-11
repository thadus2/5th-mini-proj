import { useNavigate } from 'react-router-dom';
import './style.css';
import SignInForm from '../../components/Sign/SignInForm';

export default function SignInPage() {
    const navigate = useNavigate();
    return (
        <>
            <SignInForm />
        </>
    ); 
}