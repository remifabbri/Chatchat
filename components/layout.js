import Head from 'next/head'
import styles from './layout.module.scss'
import utilStyles from '../styles/utils.module.scss'
import Link from 'next/link'
import fire from '../config/firebase-config';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth'

const logoName = 'logo RFCompagny'
export const siteTitle = 'RFCompagny'

export default function Layout({ children, home, backOffice }) {
    const auth = useAuth();
    const user = auth.user; 
    // console.log(user);

    // console.log('layout user', user);

    return (
        <>
        <Head>
            <link rel="icon" href="/favicon.ico" />
            <meta
            name="description"
            content="Learn how to build a personal website using Next.js"
            />
            <meta
            property="og:image"
            content={`https://og-image.now.sh/${encodeURI(
                siteTitle
            )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
            />
            <meta name="og:title" content={siteTitle} />
            <meta name="twitter:card" content="summary_large_image" />
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,400;0,600;0,800;1,100;1,400&display=swap');
            </style>
        </Head>
                
        <div className={styles.heigthMax}>  
            <div className={`${styles.navLayout}`}>
                <div className={`${styles.navLeft}`}>
                    <div className={`${styles.navLogo}`}>
                        <Link href="/">
                            <a>
                                <img
                                    src="/images/LogoNoName.svg"
                                    alt={logoName}
                                />
                            </a>
                        </Link>
                    </div>
                    <div className={`${styles.blockActionToggle} ${styles.navMobile}`}>
                        <input type="checkbox" className={styles.actionToggle} />
                        <div className={styles.blockImgActionToggle}>
                            <div className={styles.imageActionToggle}></div>
                        </div>
                        <nav className={`${styles.navMenu}`}>
                            <ul className={`${styles.menuLayout}`}>
                                <li>
                                <Link href="/">
                                    <a>Accueil</a>
                                </Link>
                            </li>
                                <li>
                                    <Link href="/boutiqueClient/boutique">
                                        <a>Boutique</a>
                                    </Link>
                                </li>
                                
                                <li><a href="#Contact">Contact</a></li>
                                {user?.admin ?
                                    <ul>
                                        <li>
                                            <Link href="/backoffice/boutique/gestionBoutique">
                                                <a>Gestion Boutique</a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/backoffice/category/gestionCategories">
                                                <a>Gestion Catégories</a>
                                            </Link>
                                        </li>
                                    </ul>

                                    :
                                    <>
                                    </>

                                }
                            </ul>
                        </nav>
                    </div>

                    <nav className={`${styles.navDesktop}`}>
                        <ul>
                            <li>
                                <Link href="/">
                                    <a>Accueil</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/boutiqueClient/boutique">
                                    <a>Boutique</a>
                                </Link>
                            </li>
                            <li><a href="#Contact">Contact</a></li>
                        </ul>
                    </nav>
                    
                </div>
                <div className={styles.navRight}>
                    {!user 
                        ?
                        <Link href="/users/profile">
                                <a type="button"  href="#"><img className={`${utilStyles.svgWhite}`} src="/images/person.svg"></img></a>
                        </Link>
                        :
                        <Link href="/users/profile">
                                <a type="button"  href="#"><img className={`${utilStyles.svgWhite}`} src="/images/person.svg"></img></a>
                        </Link>
                        // <button className={`${utilStyles.ButtonAhref}`} onClick={handleLogout}>Logout</button>
                        }
                        <Link href="/users/panier">
                                <a type="button" href="#"><img className={`${utilStyles.svgWhite}`} src="/images/shopping_bag.svg"></img></a>
                        </Link>
                </div>
            </div>
            
            {backOffice && (
                <main className={`${styles.container} ${styles.containerBO}`}>{children}</main>
            )}
            {!backOffice && (
                <main className={styles.container}>{children}</main>
            )}

        
            {backOffice && (
                <div className={styles.navBackOffice}>
                    
                            <Link href="/backoffice/category/gestionCategories">
                                <div className={styles.itemsNav}>
                                    <img
                                        src="/images/icons/category-white.svg"
                                        alt={logoName}
                                    />
                                </div>
                                
                            </Link>
                    
                            <Link href="/backoffice/boutique/gestionBoutique">
                                <div className={styles.itemsNav}>
                                    <img
                                        src="/images/icons/store-white.svg"
                                        alt={logoName}
                                    />
                                </div>
                                
                            </Link>
                     
                </div>
            )}
        </div>
        </>
    )
}