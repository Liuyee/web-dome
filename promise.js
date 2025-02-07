setTimeout(()=>{
    console.log('timeout')      //进入宏任务队列  --- 开启一次新的渲染（数据实时更新）（宏任务会触发新的tick）
},0)

new Promise(resolve => {
    console.log('new Promise')  //同步执行
    resolve()
}).then(()=>{
    console.log('Promise then')  //放入微任务应用队列
}).then(()=>{
        console.log('Promise then then')
})
console.log('hi')                   // 同步执行