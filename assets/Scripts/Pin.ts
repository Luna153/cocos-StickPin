import { _decorator, Collider2D, Component, Contact2DType, Node, tween, Vec3 } from 'cc';
import { GameManerger } from './GameManerger';
const { ccclass, property } = _decorator;

@ccclass('Pin')
export class Pin extends Component {

    // 三、碰撞檢測
    protected onLoad(): void {
        
        const collider2d = this.getComponent(Collider2D);
        if(collider2d){
            collider2d.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);    
            // console.error("你的針添加碰撞器")
        }else{
            console.error("你的針沒有添加碰撞器, 無法進行回調. ")
        }


    }
    // start() {
    //     // 1-1調用位置到(0, 0, 0), 3秒
    //     this.moveTo(new Vec3(0, 0, 0), 3);  
    // }

    // update(deltaTime: number) {
        
    // }

    // 3-2當針與針之間進行碰撞
    onBeginContact(){
        console.log("contact");
        // 當兩個針頭碰撞時, gameOver會重複調用 
        GameManerger.inst.gameOver();
    }

    // 一、移動到指定位置(目標位置, 時間, 父節點)
    moveTo(targetPos:Vec3, duration:number=1, parentNode:Node = null){
        tween(this.node)

        // 製作Pin針跟著圓圈運動: 針需先到達目標位置才能動
        .to(duration, {position: targetPos}, {easing: 'smooth'})

        // 二、監測動畫結束: 針插到circle後才更新分數
        .call(()=>{
            if(parentNode!=null){
                // parentNode.addChild(this.node);
                const p = this.node.getWorldPosition();
                const rotation = this.node.getWorldRotation();
                this.node.setParent(parentNode);
                this.node.setWorldPosition(p);
                this.node.setWorldRotation(rotation);

                // 2-2更新分數: 調用GameManerger方法
                GameManerger.inst.updateScore();
            }
        })
        .start();

    }

    protected onDestroy(): void {
        const collider2D = this.getComponent(Collider2D);
        if(collider2D){
            collider2D.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);    
        }
    }
}

