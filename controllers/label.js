class Label extends Component {
    value;

    constructor (id="label", className="label", type="label") {
        super(id, className, type);
    }

    setText (value) {
        this.value = value;
        this.getDOM().innerHTML = value;
    }
}