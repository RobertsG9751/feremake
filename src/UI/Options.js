import style from './Options.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Options = props => {

    const toggleModalIn = (e) => {
        props.toggleModal({"status": true, "data":{
            "title": `${props.type}`,
            "type": `${props.type}`
        }})
    }

    return(
        <div  onClick={toggleModalIn} className={`${style.options} ${style.btn} center filterOption`}>
                <FontAwesomeIcon className={`${style.icon}`} icon={props.icon}/>
        </div>
    )
}
export default Options