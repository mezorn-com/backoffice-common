import * as React from 'react';
import { Button, createStyles, Flex, Title } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconChevronLeft } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { last } from 'ramda';

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
    const { classes } = useStyles();
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
                            leftIcon={<IconChevronLeft size={16}/>}
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
            <div className={classes.children}>
                {children}
            </div>
        </div>
    )
};

const useStyles = createStyles((theme) => {
    return {
        pageHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '40px 20px 20px 20px',
            backgroundColor: theme.colors.gray[0],
            borderBottom: `1px solid ${theme.colors.gray[2]}`,
            alignItems: 'center'
        },
        children: {
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 5
        }
    }
})

export default SubHeader;