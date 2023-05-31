import styled from 'styled-components';

const PostWrapper = styled.div`
  position: relative;
  &:hover > div {
    opacity: 1;
  }
`;

const ImageWrapper = styled.div`
  & img {
    width: 30vw;
    // height:45vw;
    border-radius: 12px;
    vertical-align: middle;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  background-image: linear-gradient(
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.8)
  );
  width: 30vw;
  border-radius: 12px;
  height: 100%;
  transition: 0.25s ease;
  opacity: 0;
  box-sizing: border-box;
  padding: 2rem;
  display: flex;
  flex-direction: column-reverse;
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
`;

const Body = styled.div`
  font-size: 1.6rem;
  color: #cccccc;
  word-break: break-word;
`;

const FloatButton = styled.div`
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 2;

  & > svg {
    width: 2.4rem;
    height: 2.4rem;
    fill: #cccccc;
    cursor: pointer;
  }
  & > svg:hover {
    fill: #ffffff;
  }
`;

export const Post = ({ post }: { post: any }) => (
  <PostWrapper>
    <ImageWrapper>
      <img src={require(`../assets/images/${post.id}.jpg`).default} />
    </ImageWrapper>
    <ImageOverlay>
      <Body>{post.description}</Body>
      <Title>{post.creator}</Title>
      <FloatButton>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path
            fill-rule="evenodd"
            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
          />
        </svg>
      </FloatButton>
    </ImageOverlay>
  </PostWrapper>
);
