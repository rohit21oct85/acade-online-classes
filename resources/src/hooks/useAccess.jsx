
import { useHistory, useLocation } from 'react-router-dom';
import useSinglePermission from './permissions/useSinglePermission';

export default function useAccess(action) {
    const location = useLocation();
    const path = location?.pathname?.split('/');
    const urls = path[2];
    const {data:permission} = useSinglePermission();
    return permission && permission.some( per => per.method_name == `${action}-${urls}`);    
    
}
