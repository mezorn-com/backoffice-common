import * as React from 'react';

interface SectionBodyProps {
	className: string;
	children: React.ReactNode;
}

const SectionBody = ({
	className,
	children
}: SectionBodyProps) => {

	const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
		if (event.target instanceof HTMLDivElement) {
			const scrollTop = event.target.scrollTop;
			const { target } = event;
			if (target) {
				// TODO: remove selectors...
				for (const section of (target.parentElement?.parentElement?.parentElement?.children ?? [])) {
					section.children[0].children[1].scrollTop = scrollTop;
				}
			}
		}
	}

	return (
		<div
			className={className}
			onScroll={handleScroll}
		>
			{children}
		</div>
	)
};

export default SectionBody;