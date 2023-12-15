import * as React from 'react';
import { Button, Flex, rem, Title } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconChevronLeft } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { last } from 'ramda';
import classes from './Layout.module.scss';

interface ISubHeaderProps {
    title?: string;
    backButton?: boolean;
    children?: React.ReactNode;
}

const SubHeader = ({
   title,
   backButton = true,
   children
}: ISubHeaderProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const goBack = () => {
        navigate(-1);
        return;
        const pathname = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
        const pathParts = pathname.split('/');
        const lastPart = last(pathParts);
        if (lastPart) {
            const lastPartLength = ('/' + lastPart).length;
            navigate(pathname.slice(0, -1 * lastPartLength));
        }
    }

    return (
        <div className={classes.pageHeader}>
            <Flex
                gap="md"
                justify="flex-start"
                align="center"
                direction="row"
            >
                {
                    backButton && (
                        <Button
                            onClick={goBack}
                            leftSection={<IconChevronLeft size={16}/>}
                            variant={'light'}
                        >
                            {t('back', { ns: 'common' })}
                        </Button>
                    )
                }
                <Title>
                    {title}
                </Title>
            </Flex>
            <div className={classes.pageChildren}>
                {children}
            </div>
        </div>
    )
};

export default SubHeader;