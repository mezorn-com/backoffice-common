import * as React from 'react';
import axios from 'axios';
import qs from 'qs';
import { TextInput, Button, Modal, createStyles, Text } from '@mantine/core';
import { IFormField } from '@/backoffice-common/types/form';
import { IResponse } from '@/backoffice-common/types/api';
import { INITIAL_ZOOM, MAP_STARTING_POINT, MAX_ZOOM, MIN_ZOOM } from '@/config';
import { MapContainer, ZoomControl } from 'react-leaflet';
import GoogleLayer from '@/backoffice-common/components/map/GoogleLayer';
import Helper from '@/backoffice-common/components/form/components/map-address-picker/Helper';
import { IMapAddressValue } from '@/backoffice-common/components/form/components/map-address-picker/types';
import { IconSearch } from '@tabler/icons-react';
import { FormLabel } from '@/backoffice-common/components/form/components';

interface IProps {
    field: IFormField;
    onChange?: (value: IMapAddressValue) => void;
    value?: IMapAddressValue;
}

interface ISuggestion {
    label: string;
    address: string;
    value: string;
}

interface ISuggestResponse {
    sessionToken: string;
    suggestions: ISuggestion[];
}

interface IDetailResponseData {
    address: string;
    label: string;
    coordinates: {
        latitude: number;
        longitude: number;
    }
}

const useStyles = createStyles((theme) => {
    return {
        displayValue: {
            fontWeight: 600,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        },
        buttonWrapper: {
            display: 'flex',
            gap: theme.spacing.sm,
            alignItems: 'center',
        },
        search: {
            display: 'flex',
            width: '100%',
            gap: theme.spacing.sm
        },
        input: {
            flex: 1,
        },
        suggestions: {
            maxHeight: 200,
            overflowY: 'auto',
            marginTop: '.5rem'
        },
        address: {
            paddingLeft: theme.spacing.xs,
            borderColor: theme.colors.gray[3],
            borderStyle: 'solid',
            borderWidth: 0,
            display: 'list-item',
            listStyleType: 'disc',
            marginLeft: '1.3rem',
            cursor: 'pointer',
            '&:not(last-child)': {
                borderBottomWidth: 1,
            },
            '&:hover': {
                background: theme.colors.gray[1],
            }
        },
        map: {
            height: 600,
            marginTop: '1rem',
        }
    }
})

const MapAddressPicker = ({
    field,
    onChange,
    value
}: IProps) => {

    const { classes } = useStyles();

    const [ showModal, setShowModal ] = React.useState(false);
    const [ searchValue, setSearchValue ] = React.useState('');
    const [ suggestions, setSuggestions ] = React.useState<ISuggestion[]>([]);

    console.log('MAP FIELD>>>>', field);

    const handleSearch = async () => {
        if (field.suggestApi) {
            const params = {
                [field.suggestApi.searchKey]: searchValue
            }
            const { data } = await axios.get<IResponse<ISuggestResponse>>(`${field.suggestApi.uri}?${qs.stringify(params)}`);
            setSuggestions(data.data.suggestions ?? []);
        }
    };

    const handleSuggestionClick = async (suggestion: ISuggestion) => {
        if (field.retrieveApi) {
            const params = {
                addressId: suggestion.value,
            }
            const { data } = await axios.post<IResponse<[IDetailResponseData]>>(field.retrieveApi.uri, params);
            const [ address ] = data.data;
            onChange?.({
                address: address.address,
                lat: address.coordinates.latitude,
                lon: address.coordinates.longitude,
                value: suggestion.value,
            })
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setSearchValue('');
        setSuggestions([]);
    }

    const isSelected = (suggestion: ISuggestion): boolean => {
        if (!value || !value.value) {
            return false;
        }
        return value.value === suggestion.value;
    }

    return (
        <div>
            <FormLabel
                label={field.label}
                withAsterisk={field.required}
            />
            <div className={classes.buttonWrapper}>
                {
                    value?.address && (
                        <Text className={classes.displayValue}>
                            {value.address}
                        </Text>
                    )
                }
                <Button onClick={() => setShowModal(true)} compact>
                    Search Address
                </Button>
            </div>
            <Modal
                opened={showModal}
                onClose={handleClose}
                size='100%'
            >
                <div className={classes.search}>
                    <TextInput
                        data-autofocus
                        className={classes.input}
                        value={searchValue}
                        onChange={e => setSearchValue(e.currentTarget.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button
                        leftIcon={<IconSearch size='1rem'/>}
                        onClick={handleSearch}
                    >
                        Search
                    </Button>
                </div>
                {
                    suggestions.length > 0 && (
                        <div className={classes.suggestions}>
                            <Text fw={600} fz='lg'>
                                Results:
                            </Text>
                            {
                                suggestions.map(suggestion => {
                                    return (
                                        <div
                                            key={suggestion.value}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className={classes.address}
                                            style={{ fontWeight: isSelected(suggestion) ? 600 : 400 }}
                                        >
                                            {suggestion.label}
                                            &nbsp;
                                            {
                                                suggestion.address && '-'
                                            }
                                            &nbsp;
                                            {suggestion.address}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }
                {
                    value?.address && !suggestions.length && (
                        <Text>
                            {value.address}
                        </Text>
                    )
                }
                <div className={classes.map}>
                    <MapContainer
                        center={MAP_STARTING_POINT}
                        zoom={INITIAL_ZOOM}
                        style={{ width: '100%', height: '100%' }}
                        scrollWheelZoom={false}
                        touchZoom={false}
                        doubleClickZoom={false}
                        inertia={false}
                        zoomControl={false}
                        maxZoom={MAX_ZOOM}
                        minZoom={MIN_ZOOM}
                    >
                        <Helper value={value}/>
                        <GoogleLayer/>
                        <ZoomControl position={'bottomleft'}/>
                    </MapContainer>
                </div>
            </Modal>
        </div>
    )
};

export default MapAddressPicker;