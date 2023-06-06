import React, { useCallback, useEffect, useState } from 'react';
import { axiosReq } from '../../api/axiosDefaults';
import Pet from '../pets/Pet';
import Tale from '../tales/Tale';
import Pic from '../pics/Pic';
import InfiniteScroll from 'react-infinite-scroll-component';
import Container from 'react-bootstrap/Container';
import appStyles from '../../App.module.css';
import Asset from '../../components/Asset';

const HomePageSorted = () => {
    const [combinedData, setCombinedData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMorePets, setHasMorePets] = useState(true);
    const [hasMorePics, setHasMorePics] = useState(true);
    const [hasMoreTales, setHasMoreTales] = useState(true);

    const handleError = (error) => {
        if (error.response && error.response.status === 404) {
            return { data: { results: [] } };
        }
        throw error;
    };

    const fetchData = useCallback(async () => {
        if (isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            let newData = [];

            // Fetch pets data if hasMorePets is true
            if (hasMorePets) {
                const pets = await axiosReq.get(`/pets?page=${page}`).catch(handleError);
                if (pets && pets.data && pets.data.results) {
                    // Add 'type' property to each pet object for rendering
                    const petsWithTypes = pets.data.results.map((pet) => ({ ...pet, type: 'Pet' }));
                    newData = [...newData, ...petsWithTypes];
                    setHasMorePets(!!pets.data.next);
                } else if (pets && pets.error) {
                    console.log('Error in pets request:', pets.error.message);
                    setHasMorePets(false);
                }
            }

            // Fetch pics data if hasMorePics is true
            if (hasMorePics) {
                const pics = await axiosReq.get(`/petpics?page=${page}`).catch(handleError);
                if (pics && pics.data && pics.data.results) {
                    // Add 'type' property to each pic object for rendering
                    const picsWithTypes = pics.data.results.map((pic) => ({ ...pic, type: 'Pic' }));
                    newData = [...newData, ...picsWithTypes];
                    setHasMorePics(!!pics.data.next);
                } else if (pics && pics.error) {
                    console.log('Error in pics request:', pics.error.message);
                    setHasMorePics(false);
                }
            }

            // Fetch tales data if hasMoreTales is true
            if (hasMoreTales) {
                const tales = await axiosReq.get(`/pettales?page=${page}`).catch(handleError);
                if (tales && tales.data && tales.data.results) {
                    // Add 'type' property to each tale object for rendering
                    const talesWithTypes = tales.data.results.map((tale) => ({ ...tale, type: 'Tale' }));
                    newData = [...newData, ...talesWithTypes];
                    setHasMoreTales(!!tales.data.next);
                } else if (tales && tales.error) {
                    console.log('Error in tales request:', tales.error.message);
                    setHasMoreTales(false);
                }
            }

            //  Sort new data by timestamp
            newData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            setCombinedData((prevData) => [...prevData, ...newData]);
            setPage((prevPage) => prevPage + 1);
        } catch (err) {
            console.log('Error in fetchData:', err.message);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, page, hasMorePets, hasMorePics, hasMoreTales]);

    useEffect(() => {
        fetchData();
    }, []);

    const loadMoreData = () => {
        fetchData();
    };

    // Add a useEffect to log the combinedData whenever it changes
    useEffect(() => {
        console.log('combinedData:', combinedData);
    }, [combinedData]);

    const sortDataByTimestamp = (data) => {
        return data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    };

    return (
        <div style={{ height: '100%', overflow: 'auto' }}>
            {isLoading ? (
                <Container className={appStyles.Content}>
                    <Asset spinner />
                </Container>
            ) : (
                <InfiniteScroll
                    dataLength={combinedData.length}
                    next={loadMoreData}
                    hasMore={hasMorePets || hasMorePics || hasMoreTales}
                    loader={<h4>Loading...</h4>}
                >
                    {sortDataByTimestamp(combinedData).map((dataItem, index) => {
                        if (dataItem.type === 'Pet') {
                            return <Pet key={index} {...dataItem} />;
                        } else if (dataItem.type === 'Tale') {
                            return <Tale key={index} {...dataItem} />;
                        } else if (dataItem.type === 'Pic') {
                            return <Pic key={index} {...dataItem} />;
                        } else {
                            return null;
                        }
                    })}
                </InfiniteScroll>
            )}
        </div>
    );
};

export default HomePageSorted;
