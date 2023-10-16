import * as React from 'react';
import { useMapEvents, Marker } from 'react-leaflet'
import L, { LatLngExpression, LatLngLiteral, LatLngTuple } from 'leaflet';
import markerIcon2x from './marker-icon-2x.png';
import markerShadow from './marker-shadow.png'

const icon = L.icon({
    iconUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

interface LocationMapHelperProps {
    location: LatLngLiteral;
    onDrag: (value: LatLngLiteral) => void;
}

const tupleToLiteral = (value: LatLngTuple): LatLngLiteral => {
    return {
        lat: value[0],
        lng: value[1],
    }
}

export const MapHelper = ({
    location,
    onDrag
}: LocationMapHelperProps) => {
    const map = useMapEvents({
        drag(e) {
            const center = e.target.getCenter() as LatLngExpression;
            if ('lat' in center && 'lng' in center) {
                onDrag(center);
            } else {
                onDrag(tupleToLiteral(center))
            }
        }
    })

    React.useEffect(()=>{
        // if (location?.length) {
        //     map.flyTo(location, map.getZoom())
        // }
    }, []);

    return <Marker key='sad' position={location} icon={icon}/>
}