import InfiniteScroll from 'react-infinite-scroll-component';
import { loadMoreNewsItems } from '../../redux/slices/newsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store/healthRecordStore';

interface NewsTickerProps {
    scope: string;
}

export const NewsTicker = (props: NewsTickerProps) => {

    const newsItems = useAppSelector(state => state.news.items);
    const hasMore = useAppSelector(state => state.news.hasMore);
    const dispatch = useAppDispatch();

    const fetchMoreNewsItems = () => {
        const beforeDate = newsItems[newsItems.length-1].publishTimestamp;
        const count = 10;
        dispatch(loadMoreNewsItems(beforeDate, count));
    }

    return (
        <InfiniteScroll
            dataLength={newsItems.length}
            next={fetchMoreNewsItems}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
        >
            {newsItems}
        </InfiniteScroll>
    );

}