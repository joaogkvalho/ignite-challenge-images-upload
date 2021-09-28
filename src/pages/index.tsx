import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Image {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface GetImagesResponse {
  after: string;
  data: Image[];
}

export default function Home(): JSX.Element {
  async function fecthImages({ pageParam = null }): Promise<GetImagesResponse>{
      const { data } = await api.get('/api/images', {
        params: {
          after: pageParam
        }
      })
      console.log(data)
      return data
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fecthImages, {
    getNextPageParam: lastPage => lastPage?.after || null
  });

  const formattedData = useMemo(() => {
    const formatted = data?.pages.flatMap(ImageData => {
      return ImageData.data.flat()
    })

    return formatted
  }, [data]);

  if(isLoading && !isError){
    return <Loading />
  }

  if(isLoading && !isError){
    return <Error />
  }

  // TODO RENDER ERROR SCREEN

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
      </Box>
    </>
  );
}
