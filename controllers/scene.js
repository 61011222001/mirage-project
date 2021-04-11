class Scene extends Component {
    constructor (id=null, className=null) {
        super((id == null) ? "scene@" + Math.floor(Math.random()*1000) : id, 
            (className == null) ? "scene" : className);
    }
}