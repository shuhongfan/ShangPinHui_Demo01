// Vue插件一定暴露一个对象
let myPlugins={}

myPlugins.install=function (Vue,options) {
    console.log('调用',Vue,options)
    Vue.directive(options.name,(element,params)=>{
        element.innerHTML = params.value.toUpperCase()
    })
}


export default myPlugins
