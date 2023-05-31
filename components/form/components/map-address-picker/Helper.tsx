import * as React from 'react';
import { useMap } from 'react-leaflet';
import IconMarker from '@/backoffice-common/lib/icon-marker/Marker';
import { IMapAddressValue } from '@/backoffice-common/components/form/components/map-address-picker/types';

interface IProps {
    value?: IMapAddressValue;
}

const Helper = ({
    value
}: IProps) => {

    const map = useMap();

    React.useEffect(() => {
        if (value) {
            map.flyTo({
                lng: value.lon,
                lat: value.lat
            })
        }
    }, [value]);

    return (
        <div>
            {
                value && (
                    <IconMarker
                        position={{
                            lat: value.lat,
                            lng: value.lon
                        }}
                    />
                )
            }
        </div>
    )
};


export default Helper;