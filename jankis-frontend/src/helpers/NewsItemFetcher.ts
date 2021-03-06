import { Models } from "../types/models";

export default class NewsItemFetcher {
    scope: string;

    constructor(scope: string) {
        this.scope = scope;        
    }
    
    fetch = async (skip: number): Promise<Models.NewsItem[]> => {
        return [];
    }
}