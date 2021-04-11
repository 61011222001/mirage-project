class Label extends Component {
    value;

    constructor (id=null, className=null) {
        super((id == null) ? "label@" + Math.floor(Math.random()*1000) : id, 
            (className == null) ? "label" : className);
    }

    setText (value) {
        this.value = value;
        this.getDOM().innerHTML = value;
    }
}