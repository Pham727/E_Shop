import Container from "@/app/components/Container";
import ProductDetails from "./ProductDetails";
import { product } from "@/app/utils/product";
import ListRating from "./ListRating";

interface IPrams {
    productId?: String;
}
const Product = ({params} : {params: IPrams}) => {
    return <div className="p-8">
        <Container>
            <ProductDetails product ={product}/>
            <div className="flex flex-col mt-20 gap-4">
                <div>Add rating</div>
                <ListRating product={product}/>
                
            </div>
        </Container>
    </div>;
}
 
export default Product;