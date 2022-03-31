import React, { useState } from 'react';
import { Models } from '../../types/models';

interface DynamicQuestionsProps {

}
export const DynamicQuestions = (props: DynamicQuestionsProps) => {

    const [questions] = useState<Models.Interview.Question[]>([]);

    return (
        <div>
            {questions.map((question,idx) => (
                <div key={idx + ''}>
                    {question.text}
                </div>
            ))}
        </div>
    );
}