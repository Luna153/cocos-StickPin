import { _decorator, Camera, Color, Component, director, input, Input, instantiate, Label, Node, Prefab, tween } from 'cc';
import { Pin } from './Pin';
import { Circle } from './Circle';
const { ccclass, property } = _decorator;

@ccclass('GameManerger')
export class GameManerger extends Component {

    private static _inst: GameManerger = null;


    public static get inst(){
        return this._inst;
    }


    @property(Node)
    p1: Node = null;
    @property(Node)
    p2: Node = null;
    @property(Node)
    p3: Node = null;

    @property(Prefab)
    pinPrefab: Prefab = null;

    @property
    moveDuration:number = 0.5;

    @property(Node)
    circleNode:Node = null;

    @property(Label)
    scoreLabel: Label = null;

    @property(Camera)
    camera: Camera = null;

    @property // 相機尺寸
    targetOrthoHeight: number = 500;

    @property(Color)
    targetColor: Color = new Color();

    private curPin: Pin = null;
    private score: number = 0;
    private isGameOver: boolean = false;
    private isColorLerp: boolean = false;

    protected onLoad(): void {
        GameManerger._inst = this;
        // 二、點擊滑鼠左鍵時, 執行onTouchStart
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    start() {
        this.pinSpawn();
    }

    update(deltaTime: number) {
        // 4-2動畫顏色問題處理: 閃爍
        // console.log(this.camera.clearColor.r+"-"+this.camera.clearColor.g+"-"+this.camera.clearColor.b);
        if (this.isColorLerp) {
            let outColor = new Color();
            Color.lerp(outColor, this.camera.clearColor, this.targetColor, deltaTime * 2)

            this.camera.clearColor = outColor;

        }
        // console.log(this.camera.clearColor.g);
        // console.log(this.camera.clearColor.b);
    }


    onTouchStart(){
        // 3-2 遊戲結束時, 不執行position 2->3 動畫
        // gameOver的時候, 分數不會再增加
        if(this.isGameOver) return;
        // this.score++;
        // this.scoreLabel.string = this.score.toString();

        // 2-2調用class Pin的方法: 克隆Pin從position2移動到position3
        this.curPin.moveTo(this.p3.position, this.moveDuration, this.circleNode);
        this.pinSpawn();
    }

    // 控制針插到circle時, 才更新分數: class Pin動畫結束執行時才呼叫
    updateScore(){
        this.score++;
        this.scoreLabel.string = this.score.toString();
    }

    // 一、生成針 
    pinSpawn() {
        // 實例化出新節點
        const pinNode = instantiate(this.pinPrefab);
        this.node.addChild(pinNode);
        // 針的初始位置在position1
        pinNode.setPosition(this.p1.position)

        //克隆pin物件
        this.curPin = pinNode.getComponent(Pin);
        if(this.curPin){
            // 調用class Pin的方法: 執行動畫, 從position1移動到position2
            this.curPin.moveTo(this.p2.position, this.moveDuration)
        }else{
            console.error("你實例化的針身上沒有Pin組件, 請檢查. ")
        }
    }

    // 三、遊戲結束: 保證只處理一次
    gameOver(){
        // 當isGameOver為false不會return, 往下繼續執行
        if (this.isGameOver) return;

        // 防止gameover被多次調用
        // console.log('gameover')

        // isGameOver被觸發, 為true的時候會return
        this.isGameOver = true

        // 圓圈停止旋轉: 取得circleNode組件後, 調用class Circle stopRotate()
        this.circleNode.getComponent(Circle).stopRotate();

        // 四、遊戲結束的動畫
        tween(this.camera)
            .to(0.5, { orthoHeight: this.targetOrthoHeight }, { easing: "smooth" })
            .start();
        // 4-3顏色漸變true才會進行差值運算
        this.isColorLerp = true;

        // 4-4 2秒後重新加載
        this.scheduleOnce(() => {
            // console.log(director.getScene())
            director.loadScene(director.getScene().name);
        }, 2)
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }
}

