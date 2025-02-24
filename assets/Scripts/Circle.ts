import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Circle')
export class Circle extends Component {

    @property
    rotateSpeed:number = 90;

    // 預設保持旋轉
    private isRotate:boolean = true;


    start() {

    }

    // 一、circle持續旋轉
    update(deltaTime: number) {
        if(this.isRotate == false) return;
        // 使用+-控制 順/逆 時針旋轉
        this.node.angle -= this.rotateSpeed*deltaTime;
    }
    
    // 二、停止旋轉
    stopRotate(){
        this.isRotate = false;
    }
}

