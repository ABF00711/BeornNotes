import React, { useState } from "react";
import "./style.css";
import useAuth from "../../../Hooks/useAuth";

const plans = [
    {
        link: 'https://buy.stripe.com/test_3cI14ofwF8DRcjB4l54AU00',
        priceId: 'price_1SEOlALv7qHDaWUdlyJfHKZJ',
        price: 19,
        duration: 'month',
    },
    {
        link: 'https://buy.stripe.com/test_5kQ9AUacl1bpfvN3h14AU01',
        priceId: 'price_1SEP9NLv7qHDaWUdH3VxwxE8',
        price: 99,
        duration: 'year',
    }
]

function Subscription() {
    const { userData } = useAuth();
    const [plan, setPlan] = useState(plans[0]);

    return (
        <div className="subscription">
            <div className="subscription-header">
                <h1>BeornNotes Subscription</h1>
                <p>Hello {userData.name}</p>
            </div>
            <div className="subscription-plan-buttons">
                <button onClick={() => setPlan(plans[0])}>Monthly</button>
                <button onClick={() => setPlan(plans[1])}>Yearly(Save 20%)</button>
            </div>
            <div className="subscription-plan-details">
                <div className="subscription-plan-header">
                    <h2>{plan.duration} Plan</h2>
                    <p>{plan.price}</p>
                </div>
                <a href={plan.link} target="_blank" rel="noopener noreferrer">Subscribe</a>
            </div>
        </div>
    );
}

export default Subscription;