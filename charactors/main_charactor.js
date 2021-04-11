class MainCharactor extends Charactor {
    constructor (id=null, className=null) {
        super((id == null) ? "main_charactor@" + Math.floor(Math.random()*1000) : id, 
            (className == null) ? "main_charactor" : className);
        
        this.setSize(50, 50);
        this.setPosition(0, 0);

        this.setBackgroundColor("#6666ff");
    }
}