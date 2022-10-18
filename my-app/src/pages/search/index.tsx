import { useState, FormEvent } from "react";
import Modal from 'react-modal';

import { canSSRAuth } from "../../utils/canSSRAuth";

import apiyoutube from '../../services/youtube/youtube'
import youtubeVideoById from "../../services/youtube/youtube_video";

import Head from "next/head";
import { ModalVideo } from '../../components/ModalVideo';
import { Header } from "../../components/ui/Header";
import styles from "./styles.module.scss";

import Link from "next/link";

export type VideoProps = {
    "kind": "youtube#searchResult",
    "id": {
      "kind": string,
      "videoId": string,
      "channelId": string,
      "playlistId": string
    },
    "snippet": {
      "publishedAt":string,
      "channelId": string,
      "title": string,
      "description": string,
      "thumbnails": {
        high: {
          "url": string,
          "width": string,
          "height": string
        }
      },
      "channelTitle": string
    }
  }

  interface SearchProps{
    videos: VideoProps[],
  }


export default function Search({ videos }: SearchProps) {
    const [ query, setQuery ] = useState('')
    const [ chopper, setChopper ] = useState(false)

    const [resultSerach , setResultSearch ] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [modalItem, setModalItem] = useState<VideoProps[]>(null);
    // implementar loading

    function handleCloseModal (){
        setModalVisible(false);
    } 

    async function handleOpenModalView(id: string){
    
        const response = await youtubeVideoById.get(`/videos`, { params: { id: id }});
        console.log(response.data)
        setModalItem(response.data.items)
        setModalVisible(true)
    }

    async function handleSearch(event: FormEvent) {
        event.preventDefault();

       if(query === ''){
        setChopper(false)
        return 
       }
       const response = await apiyoutube.get('/search', {params: { q: query }});
       
       //console.log(response)
       if(response.data){
        setResultSearch(response.data.items)
        console.log(resultSerach)
        setChopper(true)
       }
    }

    Modal.setAppElement('#__next');

    if(chopper){
        return(
            <>
                <Head>
                    <title>Search || MedTube</title>
                </Head>
                <div>
                    <Header />
                    <main className={styles.container}>
                        <form className={styles.form} onSubmit={handleSearch}>
                            <input 
                                type="text"
                                placeholder="search..."
                                className={styles.input}
                                value={query}
                                onChange={ (e) => setQuery(e.target.value )}
                                />
                            
                            <button className={styles.buttonSearch} type="submit">
                                Search
                            </button>
                            <hr />
                        </form>
                        <div className={styles.containerVideos}>
                        { resultSerach.map(video => (
                            <section key={video.id.videoId}>
                                <span>
                                    <h2>{video.snippet.title}</h2>
                                </span>
                                <button onClick={ () => handleOpenModalView(video.id.videoId) }>
                                    <div className="styles.tag">
                                        <span>
                                            <img src={video.snippet.thumbnails.high.url}  alt="thumbnails" />
                                        </span>
                                    </div>
                                </button>
                                <hr /><hr /><hr /><hr />
                            </section>
                        ))}
                        </div>
                    </main>
                    { modalVisible && (
                        <ModalVideo 
                        
                        isOpen={modalVisible}
                        onRequestClose={handleCloseModal}
                        video={modalItem}

                        />
                    )}    
                </div> 
            </>
        )
    }

    return(
        <>
            <Head>
                <title>Search || MedTube</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <form className={styles.form} onSubmit={handleSearch}>
                        <input 
                            type="text"
                            placeholder="search..."
                            className={styles.input}
                            value={query}
                            onChange={ (e) => setQuery(e.target.value )}
                            />
                        
                        <button className={styles.buttonSearch} type="submit">
                            Search
                        </button>
                        { videos }
                    </form>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) =>{
    
    return {
        props:{
            
        }
    }
})