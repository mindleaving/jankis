import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { distinct } from "../../../sharedCommonComponents/helpers/CollectionHelpers";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadObject } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { loadActionBuilder } from "../../../sharedHealthComponents/redux/helpers/ActionCreatorBuilder";
import { RemoteState } from "../../../sharedHealthComponents/types/reduxInterfaces";
import { AsyncActionCreator } from "../../../sharedHealthComponents/types/reduxTypes";
import { Models } from "../../types/models";

export interface NewsState extends RemoteState<Models.NewsItem> {
    hasMore: boolean;
}

const initialState: NewsState = {
    items: [],
    isLoading: false,
    isSubmitting: false,
    hasMore: true
}

export const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setHasMore: (state, action: PayloadAction<boolean>) => {
            state.hasMore = action.payload;
        },
        setNews: (state, action: PayloadAction<Models.NewsItem[]>) => {
            state.items = action.payload;
        },
        addNews: (state, action: PayloadAction<Models.NewsItem[]>) => {
            state.items = distinct(state.items.concat(action.payload));
        },
        addOrUpdateNews: (state, action: PayloadAction<Models.NewsItem>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        }
    }
});

export const loadMoreNewsItems: AsyncActionCreator = (beforeDate: Date, count: number) => {
    return async (dispatch) => {
        newsSlice.actions.setIsLoading(true);
        await loadObject<Models.NewsItem[]>(
            `api/news`, { beforeDate: beforeDate + '', count: count + '' },
            resolveText("News_CouldNotLoad"),
            items => {
                dispatch(newsSlice.actions.addNews(items));
                if(items.length < count) {
                    dispatch(newsSlice.actions.setHasMore(false));
                }
            },
            () => {},
            () => dispatch(newsSlice.actions.setIsLoading(false))
        );
    }
}