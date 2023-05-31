import styled from 'styled-components';
import { Post } from '../components/Post';
import posts from '../utils/posts.json';

const PostContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  margin: 7.2rem auto;
`;

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 30vw;
`;
const Index = () => {
  const { length } = posts;
  return (
    <PostContainer>
      <ColumnWrapper>
        {posts
          .filter((post, index) => index < length / 3)
          .map((post) => (
            <Post post={post} />
          ))}
      </ColumnWrapper>
      <ColumnWrapper>
        {posts
          .filter(
            (post, index) => index >= length / 3 && index < (2 * length) / 3,
          )
          .map((post) => (
            <Post post={post} />
          ))}
      </ColumnWrapper>
      <ColumnWrapper>
        {posts
          .filter((post, index) => index >= (2 * length) / 3 && index < length)
          .map((post) => (
            <Post post={post} />
          ))}
      </ColumnWrapper>
    </PostContainer>
  );
};

export default Index;
