import React from 'react';
import { LayersControl } from "react-leaflet";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
import { GOOGLE_MAP_KEY } from '@/config';

const { BaseLayer } = LayersControl;

type LayerType = 'roadmap' | 'satellite' | 'terrain' | 'hybrid';
interface IBaseLayer {
    name: string;
    type: LayerType;
}

const baseLayers: IBaseLayer[] = [
    {
        name: 'Roadmap',
        type: 'roadmap',
    },
    {
        name: 'Satellite',
        type: 'satellite',
    },
    {
        name: 'Hybrid',
        type: 'hybrid',
    },
    {
        name: 'Terrain',
        type: 'terrain',
    },
];

const GoogleLayer = () => {
    return (
        <LayersControl position="bottomright">
            {
                baseLayers.map((layer, index) => {
                    const checked = index === 0;
                    return (
                        <BaseLayer checked={checked} name={layer.name} key={layer.type}>
                            <ReactLeafletGoogleLayer
                                apiKey={GOOGLE_MAP_KEY}
                                type={layer.type}
                            />
                        </BaseLayer>
                    )
                })
            }
        </LayersControl>
    );
};

export default GoogleLayer;