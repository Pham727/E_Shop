import {getCurrentUser} from '@/actions/getCurrentUser';
import getProducts from '@/actions/getProducts';
import Container from "@/app/components/Container";
import ManageProductClient from "./ManageProductClient"
import NullData from "@/app/components/NullData";

const ManageProducts = async() => {

    //const products = await getProducts({category: null, searchTerm: null});
    const products = await getProducts({category: null});
    const currentUser = await getCurrentUser()

    if(!currentUser || currentUser.role !== "ADMIN"){
        return <NullData title = "Oops! Access denied"/>
    }

    return ( 
        <div>
            <Container>
                <ManageProductClient products = {products}/>
            </Container>
        </div>
     );
}
 
export default ManageProducts;