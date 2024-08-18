import {getCurrentUser} from '@/actions/getCurrentUser';
import getOrdersByUserId from '@/actions/getOrdersByUserId';
import Container from "@/app/components/Container";
import OrderClient from "./OrderClient"
import NullData from "@/app/components/NullData";

const Orders = async () => {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        return <NullData title = "Oops! Access denied"/>
    }

    const orders = await getOrdersByUserId(currentUser.id);
    
    if (!orders) {
        return <NullData title = "No orders yet..."/>
    }

    return ( 
        <div>
            <Container>
                <OrderClient orders = {orders}/>
            </Container>
        </div>
     );
}
 
export default Orders;