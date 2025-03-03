<template >
     <el-card class="media-main">
        <div class="media-container">
            <div class="media-player">
                <video src="@/assets/video/media.mp4"></video>
            </div>
            <div class="media-controls">
                <div class="media-progress">
                    <p class="media-time"><span class="media-time-current">00:00:00</span> / <span
                            class="media-time-total">00:00:00</span>
                    </p>
                    <div class="line">
                        <div class="unit"></div>
                    </div>
                </div>
                <div class="media-operation">
                    <div class="left">
                        <i id="contr-play" class="iconfont icon-player icon-pause"></i>
                    </div>
                    <div class="right">
                        <input type="range" id="contr-volume">
                        <i id="contr-mute" class=" iconfont icon-volume"></i>
                        <i id="contr-loop" class=" iconfont icon-loop"></i>
                        <i id="contr-full" class=" iconfont icon-fullscreen"></i>
                    </div>
                </div>
            </div>
        </div>
     </el-card>
</template>
<script setup>
import { onMounted } from 'vue';
import common from "@/util/common"
import Storage from "@/util/storage"
const { getStyle, $, getPosition, animation } =common
onMounted(() => { 
    class myVideo {
        //私有属性，代理拦截
        #paused = true;
        // #muted = false;
        constructor(player = $(".media-player video")) {
            this.storage = new Storage();
            this.player = player;
            this.$ele = {
                $main: $(".media-container"),
                $screen: $(".media-player"),
                $controls: $(".media-controls"),
                $contr_play: $("#contr-play"),
                $totalTime: $(".media-time-total"),
                $currentTime: $(".media-time-current"),
                $progressMain: $(".media-progress"),
                $progress: $(".media-progress .line"),
                $unit: $(".unit"),
                $fullscreen: $("#contr-full"),
                $loop: $("#contr-loop"),
                $volumn: $("#contr-volume"),
                $mute: $("#contr-mute"),
            };
            this.progress = {
                isDown: false,
                maxWidth: $(".media-progress").offsetWidth,
            };
            this.canPlay = false;
            // this.isPaused = true;
            this.eventListener();
        }
        set isPaused(value) {
            if (value) {
                this.myPause();
            } else {
                this.myPlay();
            }
            this.#paused = value;
        }
        get isPaused() {
            return this.#paused;
        }

        eventListener() {
            let { $controls, $screen, $contr_play, $fullscreen, $progressMain, $loop, $volumn, $mute } = this.$ele;
            //控制栏显示隐藏
            let timer;
            $screen.addEventListener("mouseenter", () => {
                this.controlShow();
            });
            $screen.addEventListener("mousemove", () => {
                this.controlShow();
                clearTimeout(timer);
                timer = setTimeout(() => {
                    this.controlHide();
                }, 1000)
            });
            $controls.addEventListener("mouseenter", () => {
                clearTimeout(timer);
            });
            $controls.addEventListener("mouseleave", () => {
                timer = setTimeout(() => {
                    this.controlHide();
                }, 1000)
            });

            //初始化视频
            this.player.addEventListener("canplay", () => {
                this.initPlayer();
            })
            //视频播放暂停
            $contr_play.addEventListener("click", () => {
                if (!this.canPlay) return false;
                this.isPaused = !this.player.paused;
            })
            //视频进度展示
            this.player.addEventListener("timeupdate", () => {
                this.setCurrentTime();
            })
            //进度条拖拽
            const progressDragMap = {
                "mousedown": (e) => {
                    this.progress.isDown = true;
                    this.isPaused = true;
                    if (e.target.classList.contains("unit")) return false;
                    let time = this.getCurrentTime(e);
                    this.setCurrentTime(time);
                },
                "mousemove": (e) => {
                    if (!this.progress.isDown) return false;
                    let time = this.getCurrentTime(e);
                    this.setCurrentTime(time);
                },
                "mouseup": () => {
                    if (!this.progress.isDown) return false;
                    this.progress.isDown = false;
                    this.isPaused = false;
                },
            }
            function progressDrag(e) {
                e.preventDefault();
                let type = e.type;
                progressDragMap[type] && progressDragMap[type](e);
            }
            $progressMain.addEventListener("mousedown", progressDrag.bind(this));
            document.addEventListener("mousemove", progressDrag.bind(this));
            document.addEventListener("mouseup", progressDrag.bind(this));

            //全屏
            $fullscreen.addEventListener("click", (e) => {
                let isFullScreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
                e.target.classList.toggle("highlight");
                if (isFullScreen) {
                    this.myExitFullscreen();
                } else {
                    this.myRequestFullscreen();
                }

            })
            //循环播放
            $loop.addEventListener("click", (e) => {
                this.controlLoop(e);
            })
            //控制音量
            $volumn.addEventListener("change", (e) => {
                let volume = e.target.value / 100;
                this.setVolumn(volume)
            })
            //静音
            $mute.addEventListener("click", (e) => {
                e.target.classList.toggle("highlight");
                this.player.muted = !this.player.muted;
            })
            //记住播放时长
            document.addEventListener("visibilitychange", () => {
                if (document.hidden) {
                    let src = this.player.src;
                    let time = this.player.currentTime;
                    this.storage.setStorage(src, time);
                }
            })
        }
        initPlayer() {
            /*
            设置视频当前时长后，会在再次听到canplay事件
            该初始化函数只在第一次加载视频完成后执行
            */
            if (this.canPlay) return false;
            this.canPlay = true;

            //显示总时长
            this.$ele.$totalTime.innerText = this.formatTime(this.player.duration);
            let volume = this.player.volume;
            //初始音量
            this.setVolumn(volume);
            //恢复为上一次退出时的播放时长
            this.setHistory();
        }
        setHistory() {
            let src = this.player.src;
            let time = ~~Number(this.storage.getStorage(src));
            if (!time) return false;
            this.setCurrentTime(time);
        }
        setVolumn(volume) {
            this.player.volume = volume;
            this.$ele.$volumn.value = volume * 100;
        }
        controlLoop(e) {
            this.player.loop = !this.player.loop;
            e.target.classList.toggle("highlight");
        }
        setProgress() {
            let radio = (this.player.currentTime / this.player.duration) * 100;
            this.$ele.$progress.style.width = `${radio}%`;
        }
        getCurrentTime(e) {
            let { x: oX } = getPosition(this.$ele.$progress);
            let tX = e.clientX;
            let _x = tX - oX;
            let rate = (_x / this.progress.maxWidth);
            rate = Math.min(1, Math.max(0, rate));
            let time = rate * this.player.duration;
            return time;
        }
        setCurrentTime(time) {
            if (time) {
                this.player.currentTime = time;
            } else {
                time = this.player.currentTime;
            }
            this.$ele.$currentTime.innerText = this.formatTime(time);
            this.setProgress();
        }
        myPlay() {
            this.$ele.$contr_play.classList.remove("icon-player");
            this.player.play();
        }
        myPause() {
            this.$ele.$contr_play.classList.add("icon-player");
            this.player.pause();
        }
        myRequestFullscreen() {
            const requestFullScreens = ['requestFullscreen', 'webkitRequestFullScreen', 'mozRequestFullScreen', 'msRequestFullscreen'];
            let video = this.$ele.$main;
            for (let i = 0; i < requestFullScreens.length; i++) {
                let key = requestFullScreens[i];
                if (video[key]) {
                    video[key]();
                    return false;
                }
            }
        }
        myExitFullscreen() {
            const exitFullScreens = ['exitFullscreen', 'webkitCancelFullScreen', 'mozCancelFullScreen', 'msExitFullscreen'];
            for (let i = 0; i < exitFullScreens.length; i++) {
                let key = exitFullScreens[i];
                console.log();
                if (document[key]) {
                    document[key]();
                    return false;
                }
            }

        }
        controlShow() {
            let bottom = getStyle(this.$ele.$controls, "bottom");
            if (Number(bottom) === 0) return false;
            animation(this.$ele.$controls, {
                bottom: 0
            }, 300, "linear")
        }
        controlHide() {
            animation(this.$ele.$controls, {
                bottom: "-54px"
            }, 300, "linear")
        }
        formatTime(time) {
            let [h, m, s] = [~~(time / 3600), ~~(time / 60), ~~(time % 60)].map(padLeft);
            return `${h}:${m}:${s}`;
        }

    }
    new myVideo();
    function padLeft(num) {
        return ("0" + num).slice(-2);
    }
})
</script>
<style>
* {
    margin: 0;
    padding: 0;
    user-select: none;
}

@font-face {
    font-family: "iconfont";
    src: url('fonts/iconfont.eot?t=1600426546624');
    /* IE9 */
    src: url('fonts/iconfont.eot?t=1600426546624#iefix') format('embedded-opentype'),
        /* IE6-IE8 */
        url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAS4AAsAAAAACZwAAARrAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDSAqGEIUYATYCJAMYCw4ABCAFhG0HWBtOCFGULspqsq+wKWO+GKJwXogXwkCjQQ+Evn05o/Tmdn/CWtgG7CKF5wDBE+3X3uzO7ldJh0qDrg1PXronIomYrETRBCXeT3b2b3lEpbkvLFIehM2H9pLZzSaenZwqqfxQaVQqGrOyuvDwtnv/7k9So5BJKoGZTRUuRKGkK0x2QTiRPI44CCLOEosr0+0G0l/4RJO7B8EAIYJA47YGzrlqkEjLIJhA8XigAzpJpmAVUP1xr+qf5x8s61myQaI496BcKFwuUIHGXmQtSLmCWgewTbzfuh4CYqPWYKb61l6Ip/TdBMhpmTrEJ+y0ghKhyRccm8gHgrDcszcAePB+Xn5wJB4MV9FvdLjVuaGyp3ePG401m+oojA7nBdiTwIJlgELeQv8FLsgv48TyX+BtA1IhQ/tqFrOS69292J+EWg+L1PiXB46lDIEMQJ9S5K7OHaDCkkeGYlixMFTCisJwDGwY/N9TXpbZD9gzAPwBiGwk6QcOfgcvpWOqmuni+nDbJCffPri99vX5c4JDgObuNOtT9Qobn1udt1pvXyqbSOFmnLnrUp1xT05in3ORNC6+nT8KbDu2cILh7o5rl+7K1J35e9b7WiHOI4LWDRwQhtIW7srqIIzWBM4jQrddyno3JkG8WNmroq/UENHQrkXGZmh3yKq0M7oO1tmbuCt311QH7T+SszNH3zmavW3H1gfaO3fpCqqAIVBbk3Rl6+lFYfQpjxD/1LCiaKujjpQD+89yHz9y0JxlpFBTnnAd1a2FWEvuByU7/O7KqNeXCjfdL1cSSuJRmNo0Bpn8r4CxZCUHHcjbCN6cUle4Ls4hLHIutpit6Y6v6lp58hMru1btw3RqwOWJcnTx2zmdm0nVEhLUh2y1sY2ZRsiMJ91hePo8SkrtC2z+X28ZH25J8x/lc11WCMukL2WvGeIKj5MKnvzeVZWYhp/oVg54db9lpL7krXtXOz+MYaIn3rxmf0cKGU2aLN3uOQqu3RZ9sPmavnmV/5xqhowU6qgjOVx+IowrAqhXhNR4GWQA/BR+4datAgD7sL8Y/reDi/+X/Q6P6ylpaaV/QlEAPuYvOLy+4WiCbQB/FQONFf8pRcM5VVS6w6c02xpCgLf/sbIGxMYS/JPCtVdDBTsQeUXIKQBGYASs0DSq5DI4iVXwQmsQW9JwcqJBcCQjYNEUAaJ0BozcM1ilm6iSL8HpfQGvDAexo8g6Z2I2VmINwTrFbtQ/jCxXKGiYLprot3ZjM+rXSVzl0TRMbCuFVElJlxpwEJMhDrAHTAelBjJIKIDqiZthvz+EwiTkxS4qeSgNF8uyUfRFkisUgERbCExHYW5Iv2GIxSUkyHBWphIz398NM0X56UjFTFlUgxE2a+2ISqI0QBv0wUYzl/IS2wCTA0UZEAMREoDUE17Mb+RDkHDxVl6YCyXxdMiGFZPJRUZTvTS9MXCXVwEx/aN8GLGi4sRLgLv1qI3jhqJBT1QPxg9bQb+lB834SGLzsBU0xU6/PowJAAA=') format('woff2'),
        url('fonts/iconfont.woff?t=1600426546624') format('woff'),
        url('fonts/iconfont.ttf?t=1600426546624') format('truetype'),
        /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
        url('fonts/iconfont.svg?t=1600426546624#iconfont') format('svg');
    /* iOS 4.1- */
}

.iconfont {
    font-family: "iconfont" !important;
    font-size: 32px;
    color: #ccc;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    cursor: pointer;
}

.icon-pause:before {
    content: "\e7d2";
}

.icon-loop:before {
    content: "\e6a9";
}

.icon-volume:before {
    content: "\e63a";
}

.icon-fullscreen:before {
    content: "\e640";
}

.icon-player:before {
    content: "\e62b";
}
.media-main{
    width: 100%;
    min-height: 70vh;
}
.media-container {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 500px;
    margin: auto;
    border: 1px solid #ccc;
}

.media-player {
    background-color: #333;
}

.media-player .hint {
    font-size: 20px;
    height: 30px;
    line-height: 30px;
    color: #ccc;
    font-weight: 900;
}

.media-player video {
    width: 100%;
}

.media-controls {
    box-sizing: content-box;
    position: absolute;
    bottom: -53px;
    height: 54px;
    width: 100%;
}

.media-controls .media-progress {
    margin-bottom: 0;
    position: relative;
    height: 4px;
    background-color: #ccc;
    color: aliceblue;
    cursor: pointer;
}

.media-progress:hover .line .unit {
    display: block;
}

.media-progress .media-time {
    z-index: 999;
    position: absolute;
    right: 5px;
    top: -20px;
    color: white;
}



.media-progress .line {
    position: relative;
    height: 4px;
    width: 0;
    background-color: aqua;
}

.media-progress .line .unit {
    display: none;
    position: absolute;
    right: -10px;
    top: 0;
    bottom: 0;
    height: 20px;
    width: 20px;
    margin: auto;
    border-radius: 10px;
    border: 1px solid #ccc;
    background-color: aqua;

}

.media-controls .media-operation {
    display: flex;
    justify-content: space-between;
    height: 50px;
    background-color: rgba(0, 0, 0, .5);
}

.media-operation i {
    margin: 0 10px;
}

.left,
.right {
    display: flex;
    align-items: center;
    height: 50px;
    margin: 0 20px;
}

[type="range"] {
    width: 80px;
    height: 5px;
}

.highlight {
    font-weight: bolder;
    color: white;
    text-shadow: #FC0 1px 0 10px;
}
</style>