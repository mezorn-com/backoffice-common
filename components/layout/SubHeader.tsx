import { ActionIcon, Flex, Title } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import classes from './Layout.module.scss';

interface ISubHeaderProps {
	title?: string;
	backButton?: boolean;
	children?: ReactNode;
}

const SubHeader = ({ title, backButton = true, children }: ISubHeaderProps) => {
	// const { t } = useTranslation();
	const navigate = useNavigate();
	// const location = useLocation();

	const goBack = () => {
		navigate(-1);
		return;
	};

	return (
		<div className={classes.pageHeader}>
			<Flex
				gap='md'
				justify='flex-start'
				align='center'
				direction='row'
			>
				{backButton &&
					(title && (
						<ActionIcon onClick={goBack} variant='light' size='xl'>
							{/* {t('back', { ns: 'common' })} */}
							<IconChevronLeft size={16} />
						</ActionIcon>
					))}
				<Title size='h2'>{title}</Title>
			</Flex>
			<div className={classes.pageChildren}>{children}</div>
		</div>
	);
};

export default SubHeader;
