/* eslint-disable react/no-array-index-key */
import {
  IconButton, withStyles,
} from '@material-ui/core';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import StoryProgressBar from './StoryProgressBar';

const StoriesContainer = styled.div`
  position :fixed;
  top:0;
  bottom : 0;
  right : 0;
  left : 0;
  background-color : black;
  display : flex;
  justify-content : center;
  flex-direction : column;
  div.story-container{
    outline: none;
    display : flex;
    overflow-y : hidden;
    position : fixed;
    top : 2vh;
    height : 96vh;
    flex-direction : row;
    justify-content: center;
    width : 100vw;
    .story{
        width : 40%;
        border-radius:7px;
        background-color : white;
        overflow-y: hidden;
        position : relative;
        .story-content{
          padding-bottom: 100px;
          padding-top: 30px;
        }
        .shadow-top, .shadow-bottom{
          position : absolute;
          height : 5vh;
          width : 100%;
          background: linear-gradient(180deg,rgb(0 0 0 / 20%) 0%,rgba(0,0,0,0) 100%)
        }
        .shadow-bottom{
          bottom: 0;
          background: linear-gradient(0deg,rgb(0 0 0 / 20%) 0%,rgba(0,0,0,0) 100%)
        }
    }
    .nav-button-container{
      align-items: center;
      display: flex;
      color : white!important;
      margin : 0px 20px;
    }
  }
  .progress-bars{
      z-index : 2;
      top : 3vh;
      position : fixed;
      display : flex;
      flex-direction : column;
      align-items:center;
      width : 100vw;
      .bars-container{
          width : 40%;
          display : flex;
          align-items : stretch;
      }
  }
`;

const NavButton = withStyles(() => ({
  root: {
    color: 'white',
  },
}))(IconButton);

interface StoryProps {
  children: any;
  // eslint-disable-next-line react/no-unused-prop-types
  duration:number;
}
const Story: React.FC<StoryProps> = ({ children }: StoryProps) => (
  <div className="story-content">
    {children}
  </div>
);

interface StoriesProps {
  children: React.ReactElement<StoryProps>[];
  onStoriesEnd: () => void;
}

const Stories: React.FC<StoriesProps> = ({ children, onStoriesEnd }: StoriesProps) => {
  const [currentStory, setCurrentStory] = useState(0);
  const [currentStoryProgress, setCurrentStoryProgress] = useState(0);

  const nextStory = () => {
    const max = children.length - 1;
    const next = currentStory + 1;
    if (next > max) {
      onStoriesEnd();
    } else {
      setCurrentStory(next);
      setCurrentStoryProgress(0);
    }
  };

  const previousStory = (event? : React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setCurrentStory(currentStory - 1 < 0 ? 0 : currentStory - 1);
  };
  useEffect(() => {
    const onKeyPress = (event : KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
          nextStory();
          break;
        case 'ArrowLeft':
          previousStory();
          break;
        default:
      }
    };
    document.addEventListener('keydown', onKeyPress);
    return () => document.removeEventListener('keydown', onKeyPress);
  }, [currentStory, children]);

  useEffect(() => {
    if (children && children.length) {
      let progress = 0;
      let paused = false;
      const startInterval = () => setInterval(() => {
        progress += 0.1;
        setCurrentStoryProgress(progress);
        if (progress > 100) {
          nextStory();
        }
      }, children[currentStory].props.duration / 1000);
      let timer = startInterval();
      const pauseInterval = () => {
        paused = !paused;
        if (paused) {
          clearInterval(timer);
        } else {
          timer = startInterval();
        }
      };
      const onKeyPress = (event:KeyboardEvent) => {
        if (event.key === ' ') {
          pauseInterval();
        }
      };
      document.addEventListener('keydown', onKeyPress);
      return () => {
        clearInterval(timer);
        document.removeEventListener('keydown', onKeyPress);
      };
    }
    return () => {};
  }, [currentStory, children]);

  const storyRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (storyRef.current && storyRef.current.children.length >= 3) {
      const storyContent = storyRef.current.children.item(1) as HTMLDivElement;
      // console.log(storyContent.getBoundingClientRect());
      const actualHeight = storyContent.getBoundingClientRect().height;
      const availableHeight = storyRef.current.getBoundingClientRect().height;
      const missingHeight = Math.max(0, actualHeight - availableHeight);
      const scrollProgress = Math.min(Math.max(currentStoryProgress, 20), 80) - 20;
      const storyOffset = (scrollProgress * missingHeight) / 60;
      storyContent.style.marginTop = `-${storyOffset}px`;
    }
  }, [currentStoryProgress]);

  useEffect(() => {
    const onKeyPress = (event : KeyboardEvent) => {
      console.log(event.key);
      if (event.key === 'Escape') {
        onStoriesEnd();
      }
    };
    document.addEventListener('keydown', onKeyPress);
    return () => document.removeEventListener('keydown', onKeyPress);
  }, []);

  return (
    <StoriesContainer>
      <div className="progress-bars">
        <div className="bars-container">
          {children.map((_, index) => {
            let progress = 100;
            if (index === currentStory) {
              progress = currentStoryProgress;
            }
            if (index > currentStory) {
              progress = 0;
            }
            return <StoryProgressBar progress={progress} key={index} />;
          })}
        </div>
      </div>
      <div
        className="story-container"
        onClick={nextStory}
        onKeyPress={() => {}}
        role="button"
        tabIndex={0}
      >
        <div className="nav-button-container">
          <NavButton onClick={previousStory} style={{ visibility: currentStory === 0 ? 'hidden' : 'visible' }}>
            <ArrowBackIos />
          </NavButton>
        </div>
        <div className="story active" ref={storyRef}>
          <div className="shadow-top" />
          {children[currentStory]}
          <div className="shadow-bottom" />
        </div>
        <div className="nav-button-container">
          <NavButton onClick={nextStory}>
            <ArrowForwardIos />
          </NavButton>
        </div>

      </div>

    </StoriesContainer>
  );
};

export { Stories, Story };
