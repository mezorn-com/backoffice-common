import * as React from 'react';

export const useBodyScrolls = () => {
    const leftBodyRef = React.useRef<HTMLDivElement>(null);
    const centerBodyRef = React.useRef<HTMLDivElement>(null);
    const rightBodyRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const tableBodyElements: HTMLDivElement[] = [];
        for (const tableBody of [leftBodyRef, centerBodyRef, rightBodyRef]) {
            if (tableBody.current) {
                tableBodyElements.push(tableBody.current);
            }
        }
        const scrollAll = (scrollTop: number)  => {
            tableBodyElements.forEach((element) => {
                element.scrollTop = scrollTop;
            })
        }

        tableBodyElements.forEach(element => {
            element.addEventListener('scroll', (e) => {
                if (e.target) {
                    scrollAll((e.target as HTMLDivElement).scrollTop);
                }
            })
        })
    }, []);

    return {
        leftBodyRef,
        centerBodyRef,
        rightBodyRef
    }
}