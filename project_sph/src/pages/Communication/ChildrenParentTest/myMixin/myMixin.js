export default {
    methods: {
        tinghua(){
            console.log('我是小明，我听爸爸的话');
        },
        geiQian(money){
            console.log(this.$parent)
            this.money-=money;
            this.$parent.money+=money;
        }
    }
}
