import { useLocation } from 'react-router-dom';
import useOtherModule from './modules/useOtherModule';

export default function useModule() {
    const {data:modules} = useOtherModule();
    const location = useLocation();
    const path = location?.pathname;
    const splitData = path.split('/')
    const urls = splitData[2];
    return modules && modules?.some(module => module?.module_slug === urls); 
}
