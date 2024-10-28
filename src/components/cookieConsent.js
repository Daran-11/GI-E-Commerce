'use client';
import CookieConsent from 'react-cookie-consent';
import { useEffect, useState } from 'react';

const CookieConsentBanner = () => {
    const [consentGiven, setConsentGiven] = useState(null);

    useEffect(() => {
        const cookieConsent = localStorage.getItem('cookieConsent');
        setConsentGiven(cookieConsent);

        if (cookieConsent) {
            console.log('User has already made a choice regarding cookies:', cookieConsent);
            // Disable tracking if rejected
            if (cookieConsent === 'rejected') {
                // Disable tracking logic here if necessary
            }
        }
    }, []);

    const handleReject = () => {
        localStorage.setItem('cookieConsent', 'rejected');
        console.log('User rejected cookies');

        // Optionally disable tracking or features here
        // disableTracking();
    };

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        console.log('User accepted cookies');

        // Send a pageview event to Plausible if not on localhost
        if (window.location.hostname !== 'localhost') {
            window.plausible && window.plausible('Cookie Consent Accepted');
        } else {
            console.log('Tracking event not sent to Plausible: Running on localhost');
        }
    };

    return (
        <>

            <CookieConsent
                location="bottom"
                buttonText="ยอมรับ"
                declineButtonText="ปฎิเสธ"
                enableDeclineButton
                cookieName="cookieConsent"
                style={{ background: "#2B373B", color: "#FFFFFF" }}
                buttonStyle={{ color: "#2B373B", fontSize: "13px", fontWeight: "bold" }}
                declineButtonStyle={{ color: "#2B373B", fontSize: "13px", fontWeight: "bold", marginLeft: '10px' }}
                expires={150}
                onAccept={handleAccept}
                onDecline={handleReject}
            >
                This website uses cookies to enhance the user experience.{" "}
                <span style={{ fontSize: "12px" }}>
                    You can read more about our cookie policy <a href="/cookie-policy" className="underline">here</a>.
                </span>
            </CookieConsent>


        </>
    );
};

export default CookieConsentBanner;
