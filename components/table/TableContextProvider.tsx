import * as React from 'react';
import { createMyStore, MyContext } from '@/backoffice-common/components/table/context';

const MyProvider = ({ children }: { children: React.ReactNode }) => {
    const store = createMyStore();
    return <MyContext.Provider value={store}>{children}</MyContext.Provider>;
};

export default MyProvider;