import React, { useState } from 'react';
import utilStyles from '../styles/utils.module.scss'
import styleNL from '../styles/component/needLog.module.scss'
import Link from 'next/link'

export default function NeedLog() {

    

    return (
      <div className={styleNL.mainBlock}>
        <div className={`${utilStyles.btnGroup}`} role="group" aria-label="Call to action">            
            <Link href="/users/register">
                <a type="button" className={`${utilStyles.ButtonAhref}`} href="#">SignUp</a>
            </Link>  
            {/* <span className={`${utilStyles.btnCircle} ${utilStyles.btnOr}`}>or</span> */}
            <Link href="/users/login">
                <a type="button" className={`${utilStyles.ButtonAhref}`} href="#">SignIn</a>
            </Link>
        </div>
        <Link href="/users/resetpassword">
          <a className={`${styleNL.linkBtn}`}>forgot your password ?</a>
        </Link>
      </div>
    )
}