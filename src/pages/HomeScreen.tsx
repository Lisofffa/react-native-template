import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useQuery} from '@apollo/client';
import {GET_POSTS} from '../apollo/queries';

const HomeScreen: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const {loading, error, data, fetchMore} = useQuery(GET_POSTS, {
    variables: {page, limit},
  });

  const loadMorePosts = () => {
    if (loading) return;

    fetchMore({
      variables: {
        page: page + 1,
      },
      updateQuery: (prev, {fetchMoreResult}) => {
        if (!fetchMoreResult) return prev;

        return {
          posts: {
            ...fetchMoreResult.posts,
            data: [...prev.posts.data, ...fetchMoreResult.posts.data],
          },
        };
      },
    });

    setPage(page + 1);
  };

  if (loading && page === 1) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  if (error) {
    return <Text>Ошибка: {error.message}</Text>;
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={data?.posts?.data || []}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.post}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text>{item.body}</Text>
          </View>
        )}
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" color="#0000ff" /> : null
        }
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  wrapper: {flex: 1, padding: 20},
  post: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  postTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
