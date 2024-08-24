'use client';
import { Product } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/app/utils/formatPrice";
import { MdDone, MdClose, MdCached, MdDelete, MdRemoveRedEye } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { getStorage, ref, deleteObject } from "firebase/storage";
import Heading from "@/app/components/Heading.tsx";
import Status from "@/app/components/Status.tsx";
import ActionBtn from "@/app/components/ActionBtn.tsx";
import axios from "axios";
import toast from "react-hot-toast";
import firebaseApp from "@/libs/firebase";

interface ManageProductClientProps{
    products: Product[]
}
const ManageProductClient: React.FC<ManageProductClientProps> = ({products}) => {
    const router = useRouter();
    const storage = getStorage(firebaseApp);

    let rows: any = [];
    if(products){
        rows = products.map((product) =>{
        return {
                id: product.id,
                name: product.name,
                price: formatPrice(product.price),
                category: product.category,
                brand: product.brand,
                inStock: product.inStock,
                images: product.images,
            }
        })
    }

    const columns: GridColDef[] = [
        {field: "id", headerName: "ID", width: 220},
        {field: "name", headerName: "Name", width: 220},
        {field: "price", headerName: "Price(USD)", width: 100, renderCell: (params) =>{
            return(
                <div className ="font-bold text-slate-800">{params.row.price}</div>
            )
        }},
        {field: "category", headerName: "Category", width: 100},
        {field: "brand", headerName: "Brand", width: 100},
        {field: "inStock", headerName: "inStock", width: 120, renderCell: (params) =>{
            return(
                <div>
                    {params.row.inStock === true ? (
                        <Status
                            text="in stock"
                            icon={MdDone}
                            bg="bg-teal-200"
                            color="text-teal-700"
                        />
                    ) : (
                        <Status
                        text="out of stock"
                        icon={MdClose}
                        bg="bg-rose-200"
                        color="text-rose-700"
                    />
                    )}
                </div>
            )
        }},
        {field: "action", headerName: "Actions", width: 200, renderCell: (params) =>{
            return(
                <div className ="flex justify-between mt-2 gap-4 w-full">
                    <ActionBtn 
                        icon={MdCached} 
                        onClick={() =>{
                            handleToggleStock(params.row.id, params.row.inStock)
                        }}
                    />
                    <ActionBtn 
                        icon={MdDelete} 
                        onClick={() =>{
                            handelDelete(params.row.id, params.row.images);
                        }}
                    />
                    <ActionBtn 
                        icon={MdRemoveRedEye} 
                        onClick={() =>{
                            router.push(`/product/${params.row.id}`);
                        }}/>
                </div>
            )
        }},
    ]

    const handleToggleStock = useCallback((id: string, inStock: boolean)=>{
        axios.put('/api/product',{
            id,
            inStock: !inStock
        }).then((res) =>{
            toast.success('Product status changed')
            router.refresh()
        }).catch((err) =>{
            toast.error("Oops! Something went wrong")
            console.log(err);
            
        })
    },[])

    const handelDelete = useCallback(async(id: string, images: any[]) => {
        toast('Deleting product, please wait!');
        const handleImageDelete = async () => {
            try {
                for (const item of images) {
                    if(item.image){
                        const imageRef = ref(storage, item.image);
                        await deleteObject(imageRef);
                        console.log("image deleted", item.image);
                        
                    }
                }
            } catch (error) {
                return console.log("Deleting images error", error);
            }
        }

        await handleImageDelete();

        // Delete product 
        axios.delete(`/api/product/${id}`).then((res) =>{
            toast.success('Product deleted')
            router.refresh()
        }).catch((err) =>{
            toast.error("Failed to delete product")
            console.log(err);
            
        })

    },[])
    return ( 
    <div className = "max-w-[1150px] m-auto text-xl">
        <div className="mb-4 mt-3">
            <Heading title ="Manage Products" center></Heading>
        </div>
        <div style ={{height: 500, width :"100%"}}>
            <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
                pagination: {
                paginationModel: { page: 0, pageSize: 9 },
                },
            }}
            pageSizeOptions={[9, 20]}
            checkboxSelection
            disableRowSelectionOnClick
            />
        </div>
       
    </div> );
}
 
export default ManageProductClient;