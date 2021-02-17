import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import utilStyles from '../../styles/utils.module.scss'

const ResetPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [notify, setNotification] = useState('');
    const auth = useAuth();
    const router = useRouter();
    
    const onSubmit = (e) => {
        e.preventDefault();

        auth.sendPasswordResetEmail(email)
        .then(()=>{
            console.log("before router.push()")
            debugger
            router.push('/users/login');
        })
    };

    return (
        <div className={utilStyles.signSection}>
            <div className={utilStyles.bgSignSection}></div>
            <div className={utilStyles.signBlock}>
                <h1>Reset Password</h1>
                {notify}
                <form onSubmit={onSubmit} className={utilStyles.formDefault} >
                    <div className={`${utilStyles.form__group} ${utilStyles.field}`}>
                        <input type="input" className={utilStyles.form__field} placeholder="Email" value={email} 
                        onChange={({target}) => setEmail(target.value)} required />
                        <label for="email" className={utilStyles.form__label}>Your Email</label>
                    </div>
                    <button type="submit" className={utilStyles.ActionButton}>Send Email</button>
                </form>
            </div>
        </div>
    );
};
export default ResetPasswordForm;