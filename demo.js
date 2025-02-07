// 寄生组合继承
function Game(){
    this.name = 'LOL'
    this.skin = ['S']
}
Game.prototype.getName = function(){
    return this.name
}

function Store(){
    this.shop = 'eee'
}
Store.prototype.getPlatform = function(){
    return this.shop
}

function LOL(arg){
    Game.call(this. arg)
    Store.call(this. arg)
}

LOL.prototype = Object.create(Game.prototype)
//多重继承 优先级
Object.assign(LOL.prototype, Store.prototype)

LOL.prototype.constructor = LOL

//面试 如何实现一个私有变量？闭包：是将内部的作用域 外泄到外部去
function createStack(){
    const items = []

    //形成独立作用域 + 模块
    return {
        push(item){
            items.push(item)
        },
        setItem() { },
        getItem() {
            return items
        }
        
    }
}
function Main(){
    this.createStack = createStack
}

const main = new Main()
main.createStack().getItem()
// 封装