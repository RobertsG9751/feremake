import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { Marker, Popup, MapContainer, TileLayer} from 'react-leaflet'
import style from './Map.module.css'
import FilterBtn from '../UI/FilterBtn';
import * as Colors from '../Data/Colors'
import Button from '../UI/Button'
import Geocode from "react-geocode";

const MapComp = props => {
   Geocode.setApiKey(process.env.REACT_APP_API_KEY);


    const [systems, setSystems] = useState([])
    let cords = []

    const fetchData = (e) =>{
        fetch(`https://lux-tsms.herokuapp.com/api/v1/systems`)
        .then(data=>data.json())
        .then(data=>{
            setSystems(data)
            cords = data.map(el=>{
                return { lat: el.systems_latitude, lng: el.systems_longitude}
            })
            return cords
       })
        .then(data=>{
            getCords(data)
        })
   }
    useEffect(()=>{
        fetchData()
    }, [])

    const addressSet = new Set()
    const getCords = data => {
        data.forEach((el, i)=>{
            Geocode.fromLatLng(el.lat, el.lng).then(
                (response) => {
                  const address = response.results[0].formatted_address.split(' ');
                  addressSet.add(address[0] + " " + address[1])
                  let addrArr = [...addressSet]
                  localStorage.setItem("addresses", JSON.stringify(addrArr))
                },
                (error) => {
                  console.error(error);
                }
              );
        })
    }

    const assignColor = (el) => {
        switch (el.type){
            case 'vārti':
                return Colors.purpleIcon
            case "konsole":
                return Colors.redIcon
            case "kontrolieris":
                return Colors.yellowIcon
            case "skaitītājs":
                return Colors.greenIcon
            case "balsts":
                return Colors.blueIcon
            default:
                return Colors.greyIcon
        }
    }
    const toggleModal = (el) =>{
        if(el.status){
            props.mapUpFunc(el)
        }else{
            props.mapUpFunc({"status": true, "data": {
                "title": "Dati",
                "type": "data",
                "id": el.target.id
            }})
        }
    }
    return(
        <MapContainer key={props.cords} center={props.cords} zoom={props.zoom} scrollWheelZoom={true}>
            <TileLayer key={props.theme}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={localStorage.getItem("mapTheme")?localStorage.getItem("mapTheme"):`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
                />
                {
                systems.map(el=>{
                    return(
                        props.filters.includes(el.type) && (
                            <Marker icon={assignColor(el)} key={el.systems_id} position={[el.systems_latitude,  el.systems_longitude]}>
                                <Popup>
                                    Iela: {el.objects_name} <br/>
                                    Garantija: {el.warranties_date} <br/>
                                    Tips: {el.type} <br/>
                                    <Button id={el.systems_id} onClick={toggleModal} propClass={style.btn} text={"Vēl dati"}></Button>
                                </Popup>
                            </Marker>
                        )
                    )
                })
            }
            <FilterBtn toggleModal={toggleModal}/>
        </MapContainer>
    )
}
export default MapComp