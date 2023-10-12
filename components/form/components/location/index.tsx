import * as React from 'react';
import { FormLabel } from '@/backoffice-common/components/form/components';
import { Button, Modal, createStyles} from '@mantine/core';
import { MapContainer } from 'react-leaflet';
import { LatLngLiteral } from 'leaflet';
import { MapHelper } from './MapHelper';
import GoogleLayer from '@/backoffice-common/components/map/GoogleLayer';
import { IconMapPin } from '@tabler/icons-react';

// const INITIAL_LOCATION: LatLngTuple = [47.9189, 106.9176];
const INITIAL_LOCATION: LatLngLiteral = {
    lat: 47.9189,
    lng: 106.9176
};

const useStyles = createStyles((theme) => {
    return {
        wrapper: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        },
        modal: {
            height: '100%'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.xs
        },
        footer: {
            marginTop: theme.spacing.xs,
            textAlign: 'right'
        },
        map: {
            flex: 1,
            border: '1px solid',
            borderColor: theme.colors.gray[5],
            borderRadius: theme.radius.md,
        }
    }
})

interface LocationProps {
    value?: LatLngLiteral;
    onSave: (value: LatLngLiteral) => void;
    label?: string;
    withAsterisk?: boolean;
}

const Location = ({
    value,
    onSave,
    label,
    withAsterisk = false
}: LocationProps) => {

    const { classes } = useStyles();

    const [ open, setOpen ] = React.useState(false);
    const [ location, setLocation ] = React.useState<LatLngLiteral | undefined>(undefined);

    const handleClose = () => {
        setOpen(false);
        setLocation(undefined);
    }

    const getMapCenter = () => {
        return value ?? INITIAL_LOCATION;
    }

    const handleSave = () => {
        if (location) {
            onSave(location);
        } else {
            onSave(value ?? INITIAL_LOCATION);
        }
        setOpen(false);
    }

    return (
        <div>
            <FormLabel
                label={label}
                withAsterisk={withAsterisk}
            />
            <Button
                onClick={() => setOpen(true)}
                leftIcon={<IconMapPin/>}
                compact
            >
                Сонгох
            </Button>
            <Modal
                keepMounted={false}
                opened={open}
                onClose={handleClose}
                size='100%'
                classNames={{ content: classes.modal, body: classes.modal }}
                withCloseButton={false}
            >
                <div className={classes.wrapper}>
                    <div className={classes.header}>
                        Location
                        <Modal.CloseButton/>
                    </div>
                    <MapContainer center={getMapCenter()} zoom={13} className={classes.map}>
                        <GoogleLayer/>
                        <MapHelper
                            location={location ?? value ?? INITIAL_LOCATION}
                            onDrag={setLocation}
                        />
                    </MapContainer>
                    <div className={classes.footer}>
                        <Button onClick={handleSave}>
                            Хадгалах
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
};

export default Location;