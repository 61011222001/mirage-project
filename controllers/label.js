class Label extends Component {
    value;

    constructor (id="label", className="label", type="label") {
        super(id, className, type);

        this.setTextAlign("left");
        this.setFontSize(14);
        this.setFontFamily('"Segoe UI",Arial,sans-serif');
    }

    setText (value) {
        this.value = value;
        this.getDOM().innerHTML = value;
    }
}