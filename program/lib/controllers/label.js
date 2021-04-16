class Label extends Component {
    value;

    constructor (id="label", className="label", type="label") {
        super(id=id, className=className, type=type);

        this.setTextAlign("left");
        this.setFontSize(16);
        this.setFontFamily("monospace");
    }

    setText (value) {
        this.value = value;
        this.getDOM().innerHTML = value;
    }
}