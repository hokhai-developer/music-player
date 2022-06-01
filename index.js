const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAER_STORAGE_KEY = "music-player";

const playList = $(".playlist");
const cd = $(".cd");
const heading = $(".dashboard header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $(".progress");
const preBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandomSong: false,
  isRepeatSong: false,
  config: JSON.parse(localStorage.getItem(PLAER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Click Pow Get Down",
      singer: "Raftaar x Fortnite",
      path: "./music/song1.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg",
    },
    {
      name: "Tu Phir Se Aana",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "./music/song2.mp3",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg",
    },
    {
      name: "Naachne Ka Shaunq",
      singer: "Raftaar x Brobha V",
      path: "./music/song3.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
    },
    {
      name: "Mantoiyat",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "./music/song4.mp3",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg",
    },
    {
      name: "Aage Chal",
      singer: "Raftaar",
      path: "./music/song5.mp3",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg",
    },
    {
      name: "Feeling You",
      singer: "Raftaar x Harjas",
      path: "./music/song6.mp3",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp",
    },
  ],
  render: function () {
    const htmlList = this.songs.map((song, index) => {
      return ` <div
                class="song ${index == this.currentIndex ? "active" : ""}"
                data-index=${index}
                >
                <div class="thumb" style="background-image: url('${
                  song.image
                }')">
                </div>
                <div class="body">
                  <h3 class="title">${song.name}</h3>
                  <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
              </div>`;
    });
    playList.innerHTML = htmlList.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    const cdWidth = cd.offsetWidth;
    const _this = this;

    //animate API
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    //xử lý khi scroll playlist nhạc
    document.onscroll = function () {
      const srcollTop = window.scrollY || document.documentElement.srcollTop;
      if (srcollTop) {
        const newCdWidth = cdWidth - srcollTop;
        cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
        cd.style.opacity = newCdWidth / cdWidth;
      }
    };

    //xử lý khi click play/pause
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    //khi nhạc  dang play
    audio.onplay = function () {
      cdThumbAnimate.play();
      _this.isPlaying = true;
      player.classList.add("playing");
    };

    //khi nhạc  dang pause
    audio.onpause = function () {
      cdThumbAnimate.pause();
      _this.isPlaying = false;
      player.classList.remove("playing");
    };

    //seek thanh tiến độ #progress
    audio.ontimeupdate = function () {
      if (audio.duration) {
        let progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    //khi 1 song ket thuc onended
    audio.onended = function () {
      if (_this.isRepeatSong) {
        audio.play();
      } else {
        _this.nextSong();
        audio.play();
      }
    };

    //khi tua nhanh
    progress.onchange = function (e) {
      let seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    //khi next song
    nextBtn.onclick = function () {
      if (_this.isRandomSong) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.srcollToActiveSong();
    };

    //khi pre Song
    preBtn.onclick = function () {
      if (_this.isRandomSong) {
        _this.playRandomSong();
      } else {
        _this.preSong();
      }
      audio.play();
      _this.render();
      _this.srcollToActiveSong();
    };

    //bat/tat random
    randomBtn.onclick = function () {
      _this.isRandomSong = !_this.isRandomSong;
      _this.setConfig("isRandomSong", _this.isRandomSong);
      randomBtn.classList.toggle("active", _this.isRandomSong);
    };

    //bat/tat repeat
    repeatBtn.onclick = function () {
      _this.isRepeatSong = !_this.isRepeatSong;
      _this.setConfig("isRepeatSong", _this.isRepeatSong);
      repeatBtn.classList.toggle("active", _this.isRepeatSong);
    };

    //khi play song = cach click vao bai hat
    playList.onclick = function (e) {
      let songNode = e.target.closest(".song:not(.active)");
      if (songNode && !e.target.closest(".option")) {
        _this.currentIndex = songNode.dataset.index;
        _this.loadCurrentSong();
        audio.play();
        _this.render();
      }
    };
  },

  loadCurrentSong: function () {
    heading.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url${this.currentSong.image}`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex > this.songs.length - 1) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  preSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex == this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  srcollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 200);
  },

  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAER_STORAGE_KEY, JSON.stringify(this.config));
  },

  loadConfig: function () {
    this.isRandomSong = this.config.isRandomSong;
    this.isRepeatSong = this.config.isRepeatSong;
  },

  start: function () {
    //định nghĩa các thuộc tính cho App
    this.defineProperties();

    //xử lý sự kiện
    this.handleEvents();

    //load bài hát hiên tại
    this.loadCurrentSong();

    //loadConfig
    this.loadConfig();

    // render song list ra UI
    this.render();
    randomBtn.classList.toggle("active", this.isRandomSong);
    repeatBtn.classList.toggle("active", this.isRepeatSong);
  },
};

app.start();
