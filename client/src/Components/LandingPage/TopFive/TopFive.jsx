import React from 'react' 
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import videoImg from './video.png';
import likesImg from '../likes.png';
import commentsImg from '../comments.png';

const TopFive = props => {
    return (
        <div className='search-page-top-five-container'>
            <div className='search-page-top-five-card'>
                {!props.data.images ? <div className='search-page-top-five-placeholder'><img src={videoImg} alt=""/>
                <p>Videos Cannot be Played</p></div> : 
                <Carousel className='carousel-image-container' showThumbs={false}>
                    {props.data.images.map(function(item, i){
                        return  <div className='search-page-top-five-card-image-container'>
                                    <img src={item} className='search-page-top-five-card-image'/>
                                </div>
                    })}
                </Carousel>
                }
            </div>
            <div className='search-page-top-five-information'>
                <p className='search-page-top-five-caption'>{props.data.caption}</p>
                <div className='search-page-top-five-likes-comments'>
                    <div className='search-page-top-five-likes'><img className='search-page-top-five-likes-comments-image' src={likesImg} alt=""/> <p>{props.data.likes}</p></div>
                    <div className='search-page-top-five-comments'><img className='search-page-top-five-likes-comments-image' src={commentsImg} alt=""/> <p>{props.data.comments}</p></div>
                </div>
            </div>
        </div>
    )
}

export default TopFive