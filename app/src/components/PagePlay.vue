<script setup>
import { getScore, authorFilter, storeHighscore, play} from '@/api'
import { ref, watchEffect } from 'vue'
import { useWorkspace } from '@/composables'
import { WalletMultiButton, WalletModalProvider} from '@solana/wallet-adapter-vue-ui'
import { useWallet } from '@solana/wallet-adapter-vue'
import axios from 'axios';

const { connected, sendTransaction } = useWallet()
const workspace = useWorkspace()
const { wallet, connection} = workspace
const myScore = ref(null)
const go = ref(null)
const loading = ref(null)
const error = ref(null)
loading.value = true;
error.value = false;
go.value = false;

// Fetch score from blockchain
watchEffect(async () => {
    if(wallet.value){
        myScore.value = await getScore(workspace, [authorFilter(wallet.value.publicKey.toBase58())])
    }
})

// Store the highscore
const store = async (highscore) => {
    rewardUser(highscore);
    if(myScore.value && myScore.value.account.score > highscore){
        return;
    }
    const score = await storeHighscore(workspace, highscore)
    myScore.value = highscore;
    return;
}

// Pay game cost
const playGame = async () => {
    const transaction = await play(workspace);
    const transactionSignature = await sendTransaction(
        transaction,
        connection
    );
    var res = await connection.confirmTransaction(transactionSignature, 'processed');
    return res;
}

// Send request for author reward
const rewardUser = async (highscore) => {
    axios.post('http://localhost:5000/reward', {
        "author": wallet.value.publicKey.toBase58(),
        "score": highscore
    })
    .then((response) => {
        console.log(response);
    }, (error) => {
        console.log(error);
    });
}

// Game Canvas
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(function(){
        document.getElementsByTagName('footer')[0].style.display = 'none';
        const canvas = document.getElementById('game');
        const ctx = canvas.getContext('2d');
        const dino = new Image();
        dino.src = 'assets/t-rex.png';

        var cactus1 = new Image();
        cactus1.src = 'assets/cactuses_small_2.png';
        var cactus2 = new Image();
        cactus2.src = 'assets/cactuses_small_2.png';
        var cactus3 = new Image();
        cactus3.src = 'assets/cactuses_small_3.png';
        const cactuses = [cactus1,cactus2,cactus3];

        // Variables
        let score;
        let scoreText;
        let highscoreText;
        let player;
        let gravity;
        let obstacles = [];
        let gameSpeed;
        let keys = {};

        // Event Listeners
        document.addEventListener('keydown', function (evt) {
        keys[evt.code] = true;
        });
        document.addEventListener('keyup', function (evt) {
        keys[evt.code] = false;
        });

        class Player {
        constructor (x, y, w, h, c) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.c = c;

            this.dy = 0;
            this.jumpForce = 10;
            this.originalHeight = h;
            this.grounded = false;
            this.jumpTimer = 0;
        }

        Animate () {
            // Jump
            if (keys['Space'] || keys['KeyW']) {
                this.Jump();
            } else {
                this.jumpTimer = 0;
            }

            /* if (keys['ShiftLeft'] || keys['KeyS']) {
            this.h = this.originalHeight / 2;
            } else {
            this.h = this.originalHeight;
            } */

            this.y += this.dy;

            // Gravity
            if (this.y + this.h < canvas.height) {
                this.dy += gravity;
                this.grounded = false;
            } else {
                this.dy = 0;
                this.grounded = true;
                this.y = canvas.height - this.h;
            }

            this.Draw();
        }

        Jump () {
            if (this.grounded && this.jumpTimer == 0) {
                this.jumpTimer = 1;
                this.dy = -this.jumpForce;
            } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
                this.jumpTimer++;
                this.dy = -this.jumpForce - (this.jumpTimer / 50);
            }
        }

        Draw () {
            ctx.beginPath();
            ctx.drawImage(this.c, this.x, this.y, this.w, this.h);
            ctx.closePath();
        }
        }

        class Obstacle {
            constructor (x, y, w, h, c) {
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
                this.c = c;

                this.dx = -gameSpeed;
            }

            Update () {
                this.x += this.dx;
                this.Draw();
                this.dx = -gameSpeed;
            }

            Draw () {
                ctx.beginPath();
                ctx.drawImage(this.c, this.x, this.y, this.w, this.h);
                ctx.closePath();
            }
        }

        class Text {
            constructor (t, x, y, a, c, s) {
                this.t = t;
                this.x = x;
                this.y = y;
                this.a = a;
                this.c = c;
                this.s = s;
            }

            Draw () {
                ctx.beginPath();
                ctx.fillStyle = this.c;
                ctx.font = this.s + "px sans-serif";
                ctx.textAlign = this.a;
                ctx.fillText(this.t, this.x, this.y);
                ctx.closePath();
            }
        }

        // Game Functions
        function SpawnObstacle () {
            let size = RandomIntInRange(50, 70);
            let type = RandomIntInRange(0, 2);
            let obstacle = new Obstacle(canvas.width + size, canvas.height - size, size, size, cactuses[type]);

            /* if (type == 1) {
                obstacle.y -= player.originalHeight - 10;
            } */
            obstacles.push(obstacle);
        }


        function RandomIntInRange (min, max) {
            return Math.round(Math.random() * (max - min) + min);
        }

        function Start(){
            if(go.value==false){
                return;
            }
            
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            /* const bgImg = new Image();
                bgImg.src = 'assets/t-rex-background.png';
                bgImg.onload = function(){
                    ctx.drawImage(bgImg,0,0, canvas.width, canvas.height);   
            } */
            ctx.font = "20px sans-serif";

            gameSpeed = 3;
            gravity = 1;

            score = 0;
            player = new Player(25, 0, 50, 50, dino);

            scoreText = new Text("Punteggio: " + score, canvas.width - 20, 45, "right", "#212121", "30");
            highscoreText = new Text("Punteggio più alto: " + (myScore.value ? myScore.value.score : '0'), 20, 55, "left", "#212121", "30");

            requestAnimationFrame(Update);
        }

        let initialSpawnTimer = 200;
        let spawnTimer = initialSpawnTimer;
        function Update () {
            if(go.value==false){
                return;
            }
            requestAnimationFrame(Update);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            spawnTimer--;
            if (spawnTimer <= 0) {
                SpawnObstacle();
                spawnTimer = initialSpawnTimer - gameSpeed * 8;
                
                if (spawnTimer < 60) {
                spawnTimer = 60;
                }
            }

            // Spawn Enemies
            for (let i = 0; i < obstacles.length; i++) {
                let o = obstacles[i];

                if (o.x + o.w < 0) {
                    obstacles.splice(i, 1);
                }

                if (
                    player.x < o.x + o.w &&
                    player.x + player.w > o.x &&
                    player.y < o.y + o.h &&
                    player.y + player.h > o.y
                ) {
                    // add score
                    store(score);
                    obstacles = [];
                    spawnTimer = initialSpawnTimer;
                    gameSpeed = 3;
                    go.value = false;
                    document.getElementById('reload-button').style.display = 'flex';
                }

                o.Update();
            }

            player.Animate();

            score++;
            scoreText.t = "Punteggio: " + score;
            scoreText.Draw();

            highscoreText.t = "Punteggio più alto: " + (myScore.value ? myScore.value.account.score : '0');
            
            highscoreText.Draw();
            gameSpeed += 0.006;
        }

        const checkIfCanPlay = async () => {
            try{
                let res = await playGame();
                if(res){
                    go.value = true;
                    loading.value = false;
                    Start();
                }
            }catch(e){
                error.value = true;
            }
        };

        checkIfCanPlay();

    },2000);

})
</script>

<template>
    <div>
        <div class="skins p-3 pb-0" :class="{'d-none': !connected || loading==true}">
            <div class="d-flex justify-content-center" id="game-canvas">
                    <canvas id="game" width="640" height="400"></canvas>
            </div>
            <div class="justify-content-center m-5" style="display:none" id="reload-button">
                <router-link :to="{ name: 'Landing' }">
                    <button class="btn btn-dark" id="back-button">&laquo; Indietro</button>
                </router-link>
                <div style="width:15px"></div>
                <button class="btn btn-outline-dark" @click="replay">Gioca di nuovo</button>
            </div>
        </div>
        <div class="skins p-3 pb-0" :class="{'d-none': loading==false}">
            <div class="d-block text-center mt-5 pt-5">
                <div class="spinner-border mt-5" :class="{'d-none': (error==true)}" style="width: 3rem; height: 3rem;" role="status">
                    <span class="sr-only"></span>
                </div>
                <h3 class="text-danger" :class="{'d-none': (error==false)}">Qualcosa è andato male! Riprovare</h3>
            </div>
            <div class="d-flex justify-content-center m-5" :class="{'d-none': (error==false)}">
                <router-link :to="{ name: 'Landing' }">
                    <button class="btn btn-dark" id="back-button">&laquo; Indietro</button>
                </router-link>
                <div style="width:15px"></div>
                <button class="btn btn-outline-dark" @click="replay">Riprova</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'PagePlay',
  methods: {
    replay(){
      location.reload();
    }
  },
}
</script>

<style scoped>
canvas{
    display: block;
    height: 500px;
    border-bottom: solid 1px black;
}
</style>
