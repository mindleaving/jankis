import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ViewModels } from "../../../localComponents/types/viewModels";
import { RemoteState } from "../../types/reduxTypes";

interface QuestionnairesState extends RemoteState {
    items: ViewModels.QuestionnaireAnswersViewModel[];
}

const initialState: QuestionnairesState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

const questionnaireAnswersSlice = createSlice({
    name: 'questionnaireAnswers',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setQuestionnaireAnswers: (state, action: PayloadAction<ViewModels.QuestionnaireAnswersViewModel[]>) => {
            state.items.push(...action.payload);
        },
        addQuestionnaireAnswer : (state, action: PayloadAction<ViewModels.QuestionnaireAnswersViewModel>) => {
            state.items.push(action.payload);
        }
    }
});

export const { setIsLoading, setIsSubmitting, setQuestionnaireAnswers, addQuestionnaireAnswer } = questionnaireAnswersSlice.actions;
export default questionnaireAnswersSlice.reducer;