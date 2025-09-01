document.addEventListener('DOMContentLoaded', () => {
    const uploadBtn = document.getElementById('uploadBtn');
    const videoInput = document.getElementById('videoInput');
    const videoTitle = document.getElementById('videoTitle');
    const authorName = document.getElementById('authorName');
    const videosGrid = document.querySelector('.videos-grid');
    const videoTemplate = document.getElementById('videoTemplate');

    let videos = JSON.parse(localStorage.getItem('videos') || '[]');
    
    // Zobrazenie existujúcich videí
    function displayVideos() {
        videosGrid.innerHTML = '';
        videos.forEach((video, index) => {
            const videoElement = createVideoElement(video, index);
            videosGrid.appendChild(videoElement);
        });
    }

    // Vytvorenie nového video elementu
    function createVideoElement(videoData, index) {
        const videoCard = videoTemplate.content.cloneNode(true);
        const video = videoCard.querySelector('video');
        const title = videoCard.querySelector('.video-title');
        const author = videoCard.querySelector('.video-author');
        const viewsCount = videoCard.querySelector('.views-count');
        const likesCount = videoCard.querySelector('.likes-count');
        const likeBtn = videoCard.querySelector('.like-btn');

        video.src = videoData.url;
        title.textContent = videoData.title;
        author.textContent = videoData.author;
        viewsCount.textContent = formatNumber(videoData.views);
        likesCount.textContent = formatNumber(videoData.likes);

        // Pridanie view counter
        video.addEventListener('play', () => {
            videos[index].views = Math.min(4500000000, videos[index].views + Math.floor(Math.random() * 10000) + 1);
            viewsCount.textContent = formatNumber(videos[index].views);
            saveVideos();
        });

        // Pridanie like system
        likeBtn.addEventListener('click', () => {
            if (!videos[index].liked) {
                videos[index].likes = Math.min(3000000, videos[index].likes + Math.floor(Math.random() * 1000) + 1);
                videos[index].liked = true;
                likeBtn.classList.add('liked');
                likesCount.textContent = formatNumber(videos[index].likes);
                saveVideos();
            }
        });

        return videoCard;
    }

    // Formátovanie čísel
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Uloženie videí do localStorage
    function saveVideos() {
        localStorage.setItem('videos', JSON.stringify(videos));
    }

    // Event listener pre tlačidlo nahrávania
    uploadBtn.addEventListener('click', () => {
        videoTitle.style.display = 'inline-block';
        authorName.style.display = 'inline-block';
        videoInput.click();
    });

    // Spracovanie výberu súboru
    videoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        
        if (file && file.type.startsWith('video/')) {
            const title = videoTitle.value.trim() || 'Neznáme video';
            const author = authorName.value.trim() || 'Anonym';
            
            const videoUrl = URL.createObjectURL(file);
            const newVideo = {
                url: videoUrl,
                title: title,
                author: author,
                views: Math.floor(Math.random() * 10000),
                likes: Math.floor(Math.random() * 1000),
                liked: false
            };
            
            videos.unshift(newVideo);
            saveVideos();
            displayVideos();
            
            // Reset formulára
            videoInput.value = '';
            videoTitle.value = '';
            authorName.value = '';
            videoTitle.style.display = 'none';
            authorName.style.display = 'none';
        } else {
            alert('Prosím, vyberte video súbor.');
        }
    });

    // Načítanie videí pri štarte
    displayVideos();
});
