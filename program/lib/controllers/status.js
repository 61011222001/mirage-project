class Status extends Component {
    maxHp = null;
    maxStn = null;
    
    currentHp = null;
    currentStn = null;

    normalSpeed = null;
    dashSpeed = null;

    damage = null;
    
    constructor () {
        super();
        
        this.setSize(200, 20);
        this.setBackgroundColor("black");
    }
}