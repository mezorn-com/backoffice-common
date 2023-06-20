import * as React from 'react';
import { Marker as LeafletMarker, MarkerProps } from 'react-leaflet';
import { Icon, Point } from 'leaflet';
import defaultMarker from '@/assets/defaultMarker';

type IconType = string | MarkerProps['icon'];

const isReactSVGElement = (variable: unknown): variable is React.ReactElement<React.SVGAttributes<SVGElement>> => {
    return React.isValidElement(variable) && (variable.type as any)?.displayName === 'svg';
}

interface ICustomMarkerProps extends Omit<MarkerProps, 'icon'> {
    icon?: IconType;
}

const IconMarker = ({
    icon,
    ...props
}: ICustomMarkerProps) => {

    const marker: MarkerProps['icon'] = React.useMemo(() => {
        if (!icon) {
            return new Icon.Default({
                iconUrl: defaultMarker,
                iconSize: [25, 41],
                iconAnchor: [12, 40],
                className: 'svg-icon'
            });
        }
        if (typeof icon === 'string') {
            return new Icon({
                iconUrl: icon,
                iconRetinaUrl: icon,
                iconAnchor: undefined,
                popupAnchor: undefined,
                shadowUrl: undefined,
                shadowSize: undefined,
                shadowAnchor: undefined,
                iconSize: new Point(30, 40),
            });
        }
        return icon;
    }, [icon]);

    return (
        <LeafletMarker
            {...props}
            icon={marker}
        />
    )
};

export default IconMarker;