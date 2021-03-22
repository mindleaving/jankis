import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import NewsItemFetcher from '../../helpers/NewsItemFetcher';

interface NewsTickerProps {
    scope: string;
}

export const NewsTicker = (props: NewsTickerProps) => {

    const newsItemFetcher = new NewsItemFetcher(props.scope);
    const [items, setItems] = useState<Models.NewsItem>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const fetchMoreNewsItems = async () => {
        const newItems = await newsItemFetcher.fetch(items.length);
        setItems(items.concat(newItems));
    }

    return (
        <InfiniteScroll
            dataLength={items.length}
            next={fetchMoreNewsItems}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
        >
            {items}
        </InfiniteScroll>
    );

}