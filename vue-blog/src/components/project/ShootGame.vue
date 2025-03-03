<template lang="">
     <div class="game-container">
        <div class="game_area">
            <div class="ball_area">
            </div>
            <div class="battery"></div>
            <div class="bullet"></div>
            <div class="battery_area">
            </div>
        </div>
        <div class="score_area">
            <div class="start">开始游戏</div>
            <p>当前分数</p>
            <span class="score">0</span>
        </div>
    </div>
</template>
<script setup>
import common from "@/util/common"
import { onMounted } from "vue";
const { $, getPosition, animation, setStyle } =common
onMounted(() => { 
    const oBallArea = $(".ball_area"), oBattery = $(".battery"), oBullet = $(".bullet"), oGanmeArea = $(".game_area"), oStart = $(".start"), oScore = $(".score");
    let ballData = [];
    const bulletData = {}
    const size = 44;
    const maxW = oBallArea.offsetWidth, maxH = oBallArea.offsetHeight;
    let isStart = false;
    init();
    initBattery();
    let timerGenerate;
    oStart.addEventListener('click', function () {
        isStart = true;
        clearInterval(timerGenerate);
        timerGenerate = setInterval(generateRow(), 10000);
    })
    oGanmeArea.addEventListener("mousemove", function (e) {
        let oX = e.clientX, oY = e.clientY;
        let { x: tX, y: tY } = getPosition(oBattery);
        tX += 30;
        tY += 56;
        let bAngle = Math.atan2(oX - tX, tY - oY) * 180 / Math.PI;
        bAngle = Math.min(80, Math.max(-80, bAngle));
        oBattery.style.transform = `rotate(${bAngle}deg)`;
    })
    let timerMove;
    let speed = 18;
    const maxX = oBallArea.offsetWidth - oBullet.offsetWidth;
    oGanmeArea.addEventListener("click", function () {
        if (!isStart) return false;
        let angle = oBattery.style.transform.match(/.*\((.+)deg\)/)?.[1] || 0;
        let radian = angle / 180 * Math.PI;
        let speedX = speed * Math.sin(radian);
        let speedY = speed * Math.cos(radian);
        clearInterval(timerMove);
        timerMove = setInterval(() => {
            let top = oBullet.offsetTop;
            let left = oBullet.offsetLeft;
            if (left < 0 || left >= maxX) {
                speedX *= -1;
            }

            // 检测与球碰撞
            let ball = collisionBall({ left, top })
            if (ball) {
                clearInterval(timerMove);
                let solts = Object.entries(findSiblings(ball.idx)).map(([key, value]) => (key,value)).filter(item => (item && !ballData[item].connect)).map(item => getDistance(ballData[item], left, top));
                //失败
                if (top > ballData[ballData.length - 1].top) {
                    clearInterval(timerGenerate);
                    isStart = false;
                    init();
                    initBattery();
                    oScore.innerText = 0;
                    return false;
                }

                let { idx: shortSlot } = getShortDistance(solts);
                hitTarget(shortSlot);
                return true
            }
            //检测与墙壁碰撞
            if (top < 0) {
                clearInterval(timerMove);
                let solts = ballData.slice(0, 10).filter(({ connect }) => !connect).map(({ index }) => index).map(item => getDistance(ballData[item], left, top));
                let { idx: shortSlot } = getShortDistance(solts);
                hitTarget(shortSlot);
                return false
            }
            oBullet.style.top = top - speedY + "px"
            oBullet.style.left = left + speedX + "px"
        }, 1000 / 60)
    })
    function generateRow(n = 10) {
        let balls = ballData.filter(({ connect }) => !connect).slice(0, n);
        balls.forEach((item => generateBall(item)))
        return generateRow;
    }

    function generateBall(ball) {
        let color = randomColor();
        ball.connect = true;
        ball.color = color;
        setStyle(ball.ele, {
            display: "block",
            backgroundColor: color,
            left: ball.left + "px",
            top: ball.top + "px"
        })
    }
    function hitTarget(idx) {
        let target = ballData[idx];
        placeBall(target, bulletData.color);
        let balls = traceColorPath([idx], true);
        let score = Number(oScore.innerText);
        if (balls.length >= 3) {
            score += balls.length;
            balls.forEach(item => {
                ballData[item].connect = false;
            })

        }
        ballData.forEach((item) => {
            if (!item.connect) return false;
            let connectBalls = traceColorPath([item.index], false);
            if (!connectBalls.some((item => item < 10))) {
                item.connect = false
                score++;
            }
        })
        oScore.innerText = score;
        initBattery();
    }

    function placeBall(ball, color = "") {
        ball.connect = true;
        ball.color = color;
        setStyle(ball.ele, {
            display: "block",
            top: ball.top + "px",
            left: ball.left + "px",
            backgroundColor: color
        })
    }
    //balls 球序号和距离数组
    function getShortDistance(balls = []) {
        return balls.reduce((acc, cur) => {
            if (cur.distance < acc.distance) return cur;
            return acc;
        }, { distance: Infinity })
    }

    function collisionBall({ left, top }) {
        let balls = ballData.filter(({ connect }) => connect);
        let collisionBalls = balls.map(item => getDistance(item, left, top)).filter(({ distance }) => distance <= size);
        if (collisionBalls.length === 0) return null;
        return collisionBalls.reduce((acc, cur) => {
            if (cur.distance < acc.distance) return cur;
            return acc;
        }, { distance: Infinity })
    }
    function getDistance(ball, left, top) {
        let _x = ball.left - left;
        let _y = ball.top - top;
        let distance = Math.sqrt(_x * _x + _y * _y);
        return {
            idx: ball.index,
            distance
        }
    }
    function initBattery() {
        let batteryLeft = oBallArea.offsetWidth / 2 - oBattery.offsetWidth / 2 + "px",
            bulletLeft = oBallArea.offsetWidth / 2 - oBullet.offsetWidth / 2 + "px",
            batteryTop = oBallArea.offsetHeight - 30 + "px",
            bullettop = oBallArea.offsetHeight + 5 + "px";
        let color = randomColor();
        bulletData.color = color;
        setStyle(oBattery, {
            left: batteryLeft, top: batteryTop
        })
        setStyle(oBullet, {
            left: bulletLeft, top: bullettop, backgroundColor: color
        })
    }
    function init() {
        oBallArea.innerHTML = "";
        ballData = [];
        let index = 0;
        let row = ~~(maxH / size);
        let column = ~~(maxW / size);
        let fragment = document.createDocumentFragment();
        for (let i = 0; i < row; i++) {
            let isOdd = !!(i % 2);
            for (let j = 0; j < column - Number(isOdd); j++) {
                let top = i * (size - 6);
                let left = (j + i % 2 / 2) * size;
                let ele = document.createElement("div");
                //let backgroundColor = randomColor();
                let ball = new Proxy({ top, left, ele, index, row: i, connect: false }, {
                    set(target, key, value) {
                        if (key === "connect" && value === false) {
                            dropBall(target.ele);
                        }
                        target[key] = value;
                        return true
                    }
                })
                ele.classList.add("ball");
                ele.innerText = index++;
                ele.style.display = "none"
                fragment.appendChild(ele);
                ballData.push(ball);
            }
        }
        oBallArea.appendChild(fragment);
    }

    function dropBall(ele) {
        animation(ele, {
            opacity: 0,
            transform: "scale(.5)",
            top: ele.offsetTop + 40 + "px",
        }, 500, "linear", function () {
            ele.style.cssText = "";
            setStyle(ele, {
                display: "none"
            })
        })
    }
    //color参数用于决定是否寻找同色的联通的球
    //true ：寻找相连的同色球
    //false：寻找相连的所有球
    function traceColorPath(sameColorSiblings = [], color = true) {
        let res = sameColorSiblings.slice();
        recu(res);
        function recu(arr) {
            for (let i = 0, len = arr.length; i < len; i++) {
                let sibling = findColrorSiblings(arr[i], color).filter((item => {
                    return res.indexOf(item) === -1;
                }));
                res.push.apply(res, sibling);
                recu(sibling);
            }
        }
        return res;
    }

    function findColrorSiblings(idx = 0, color = true) {
        return Object.entries(findSiblings(idx)).map(([key, value]) => (key,value)).filter((item) => {
            if (item === null || !ballData[item].connect) return false;
            return !color || ballData[idx]?.color === ballData[item]?.color;
        })
    }
    function findSiblings(idx = 0) {
        return getRightSlot(idx, {
            tl: idx - 10,
            tr: idx - 9,
            ml: idx - 1,
            mr: idx + 1,
            bl: idx + 9,
            br: idx + 10,
        })
    }
    function getRightSlot(index, siblings) {
        const diffMap = {
            t: -1,
            m: 0,
            b: 1
        }
        let row = ballData[index].row;
        return Object.entries(siblings).reduce(function (acc, [key, value]) {
            acc[key] = ballData[value] && isRightSlot(ballData[value].row, row, diffMap[key[0]]) ? value : null
            return acc;
        }, {})


    }
    function isRightSlot(target, source, diff) {
        return source + diff === target
    }
    function randomColor() {
        const COLORS = ['#fa5a5a', '#f0d264', '#82c8a0', '#7fccde', '#6698cb', '#cb99c5'];
        return COLORS[~~(Math.random() * COLORS.length)];
    }

})
</script>
<style>
.game-container {
    display: flex;
    width: 670px;
    height: 640px;
    box-shadow: 0 0 0 4px #ccc;
    margin: 10px auto;
}

.game_area {
    box-sizing: content-box;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 440px;
    height: 100%;
    border-right: 2px solid #ccc;
}

.ball_area {
    box-sizing: content-box;
    position: relative;
    z-index: 1;
    flex: 1;
}

.battery_area {
    position: relative;
    display: flex;
    justify-content: center;
    height: 80px;
    border-top: 2px solid #ccc;
}

.battery {
    position: absolute;
    width: 60px;
    height: 86px;
    background: url(/src/assets/image/arrow.png) no-repeat top/cover;
    transform-origin: 30px 56px;
}

.score_area {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 20px;
    font-weight: 700;
    text-align: center;
}

.score_area .start {
    width: 120px;
    height: 45px;
    line-height: 42px;
    text-align: center;
    color: white;
    background-color: #6698cb;
    border: 1px solid rgba(0, 0, 0, .21);
    border-bottom: 4px solid rgba(0, 0, 0, .21);
    border-radius: 4px;
    text-shadow: 0 1px 0 rgba(0, 0, 0, .15);
}

.score_area p {
    padding: 60px 0 8px;
    color: #608FBF;
}

.score_area .score {
    font-size: 32px;
    color: #72B08E;
}

.ball {
    display: none;
    position: absolute;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: #f0d264;
    text-align: center;
    line-height: 44px;
    color: #fff;
    box-shadow: -2px -2px 12px rgba(100, 100, 100, .7) inset;
}

.ball.active {
    color: orange;
    font-weight: 900;
    background-color: #222 !important;
}

.ball.lose {
    color: #222;
    font-weight: 900;
    background-color: rgb(34, 34, 34) !important;
}

.bullet {
    position: absolute;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: #f0d264;
    box-shadow: -2px -2px 12px rgba(100, 100, 100, .7) inset;
}
</style>