import React from 'react';
import { Accordion } from 'react-bootstrap';
import { AccordionCard } from '../../sharedCommonComponents/components/AccordionCard';

interface FrequentlyAskedQuestionsPageProps {}

export const FrequentlyAskedQuestionsPage = (props: FrequentlyAskedQuestionsPageProps) => {

    return (
        <>
            <h1>Frequently Asked Questions (FAQ)</h1>
            <Accordion>
                <AccordionCard
                    eventKey='Q1'
                    title="Can I trust my data to be safe?"
                >
                    <p>
                        No. I cannot guarantee that your data will not be hacked or leaked. What can be hacked will be hacked sooner or later. You have to be okay with that when using this portal.
                    </p>
                    <p>
                        That said, I have put a lot of effort in making sure that only people that you have given access to can access your profile and edit it. But I, like all humans, make mistakes and may not have enough knowledge to secure the website against a motivated hacker.
                    </p>
                </AccordionCard>
                <AccordionCard
                    eventKey='Q2'
                    title="Who is behind this project?"
                >
                    <p>
                        My name is Jan Scholtyssek and you can learn more about me on my website: <a href="https://janscholtyssek.dk">https://janscholtyssek.dk</a>
                    </p>
                </AccordionCard>
                <AccordionCard
                    eventKey='Q3'
                    title="How is this project financed?"
                >
                    <p>
                        I pay for the expenses myself. If you like to support me, the best way is to order an emergency card through the <a href="https://shop.doctorstodo.com/">webshop</a>.
                    </p>
                </AccordionCard>
            </Accordion>
        </>
    );

}