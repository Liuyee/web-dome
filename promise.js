setTimeout(() => {
    console.log('timeout') //进入宏任务队列  --- 开启一次新的渲染（数据实时更新）（宏任务会触发新的tick）
}, 0)

new Promise(resolve => {
    console.log('new Promise') //同步执行
    resolve()
}).then(() => {
    console.log('Promise then') //放入微任务应用队列
}).then(() => {
    console.log('Promise then then')
})
console.log('hi') // 同步执行

// 手写 promise
//状态
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REGECTED = 'REJECTED'

class Promise {
    constructor(executor) {
        // 1.默认状态
        this.statue = PENDING
        // 2.维护内部成功失败的值得
        this.value = undefined
        this.reason = undefined

        // 存放成功/失败回调
        this.onResolvedCallbacks = []
        this.onRejectedCallbacks = []

        // 成功回调
        let resolve = value => {
            if (this.statue === 'PENDINGT') {
                // 单向流出
                this.statue = FULFILLED
                this.value = value
                this.onResolvedCallbacks.forEach(fn => fn())
            }

        }

        //失败回调
        let reject = reason => {
            if (this.statue === 'PENDINGT') {
                this.statue = REGECTED
                this.reason = reason
                this.onRejectedCallbacks.forEach(fn => fn())
            }

        }
        //主执行
        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }

    }

    then(onFulFilled, onRejectd) {
        // 边缘检测
        onFulFilled
            = typeof onFulFilled === 'function' ?
            onFulFilled :
            value => value
        onRejectd
            = typeof onRejectd === 'function' ?
            onRejectd :
            error => {
                throw error
            }

        //组装内部promise2
        let promise2 = new myPromise((resolve, reject) => {
            // 主触发 
            if (this.statue === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulFilled(this.value)
                        this.resolvePromies(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0)

            }
            if (this.statue === REGECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejectd(this.reason)
                        this.reasonPromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0)

            }
            if (this.statue === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulFilled(this.value)
                            this.resolvePromies(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0)

                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejectd(this.reason)
                            this.reasonPromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0)

                })
            }

        })

        return promise2
    }
    catch (onRejectd) {
        return this.then(null.onRejectd)
    }

    resolvePromies(promise2, x, resolve, reject) {
        if (promise2 === x) {
            return reject(new TypeError('链式调用类型检测失败：promise'))
        }
        let called = false
        if (x instanceof Promise) {
            x.then(y => {
                this.resolvePromies(promise2, y, resolve, reject)
            }), error => {
                reject(error)
            }
        } else if (x !== null && (typeof x === 'object') || typeof x === 'function') {
            try {
                let then = x.then
                if (typeof then === 'function') {
                    then.call(x, y => {
                        if (called) return
                        called = true
                        this.resolvePromies(promise2, y, resolve, reject)
                    }, error => {
                        if (called) return
                        called = true
                        reject(error)
                    })
                } else {
                    resolve(x)
                }
            } catch (error) {
                if (called) return
                called = true
                reject(error)
            }
        } else {
            resolve(x)
        }
    }