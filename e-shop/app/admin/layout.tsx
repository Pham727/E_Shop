import AdminNav from '../components/admin/AdminNav';

export const metadata = {
    title: "E~Shop Admin",
    description: "E~Shop Admin Dashborad",
}

const AdminLayout = ({children} : {children: React.ReactNote}) => {

    return ( 
        <div>
            <AdminNav/>
            {children}
        </div>
     );
}
 
export default AdminLayout;
