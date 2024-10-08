import {getCurrentUser} from '@/actions/getCurrentUser';
import getOrders from '@/actions/getOrders';
import Container from "@/app/components/Container";
import ManageOrdersClient from "./ManageOrdersClient"
import NullData from "@/app/components/NullData";

const ManageOrders = async () => {
    const orders = await getOrders();
    const currentUser = await getCurrentUser()

    if(!currentUser || currentUser.role !== "ADMIN"){
        return <NullData title = "Oops! Access denied"/>
    }

    return ( 
        <div>
            <Container>
                <ManageOrdersClient orders = {orders}/>
            </Container>
        </div>
     );
}
 
export default ManageOrders;