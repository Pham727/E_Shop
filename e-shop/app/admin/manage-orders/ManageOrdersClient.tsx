'use client';
import { Product, Order, User } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatPrice } from "@/app/utils/formatPrice";
import { MdDone, MdAccessTimeFilled, MdDeliveryDining, MdRemoveRedEye } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Heading from "@/app/components/Heading.tsx";
import Status from "@/app/components/Status.tsx";
import ActionBtn from "@/app/components/ActionBtn.tsx";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";

interface ManageOrdersClientProps{
    orders: ExtendedOrder[]
}

type ExtendedOrder = Order & {
    user: User
}
const ManageOrdersClient: React.FC<ManageOrdersClientProps> = ({orders}) => {
    const router = useRouter();
    let rows: any = [];

    if(orders){
        rows = orders.map((order) =>{
        return {
                id: order.id,
                customer: order.user.name,
                amount: formatPrice(order.amount / 100),
                paymentStatus: order.status,
                date: moment(order.createData).fromNow(),
                deliveryStatus: order.deliveryStatus,
            }
        })
    }

    const columns: GridColDef[] = [
        {field: "id", headerName: "ID", width: 220},
        {field: "customer", headerName: "Customer Name", width: 130},
        {
            field: "amount", 
            headerName: "Amount(USD)", 
            width: 130, 
            renderCell: (params) =>{
                return(
                    <div className ="font-bold text-slate-800">{params.row.amount}</div>
                );
            },
        },
        {
            field: "paymentStatus", 
            headerName: "Payment Status", 
            width: 130,
            renderCell: (params) =>{
                return(
                    <div>
                        {params.row.paymentStatus === 'pending' ? (
                            <Status
                                text="pending"
                                icon={MdAccessTimeFilled}
                                bg="bg-slate-200"
                                color="text-slate-700"
                            />
                        ) : params.row.paymentStatus === 'complete' ? (
                                <Status
                                text="completed"
                                icon={MdDone}
                                bg="bg-green-200"
                                color="text-green-700"
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                )
            }
        },
        {
            field: "deliveryStatus", 
            headerName: "Delivery Status", 
            width: 130,
            renderCell: (params) =>{
                return(
                    <div>
                        {params.row.deliveryStatus === 'pending' ? (
                            <Status
                                text="pending"
                                icon={MdAccessTimeFilled}
                                bg="bg-slate-200"
                                color="text-slate-700"
                            />
                        ) : params.row.deliveryStatus === 'dispatched' ? (
                                <Status
                                text="Dispatched"
                                icon={MdDeliveryDining}
                                bg="bg-purple-200"
                                color="text-purple-700"
                            />
                        ) : params.row.deliveryStatus === 'delivered' ? (
                            <Status
                            text="Delivered"
                            icon={MdDone}
                            bg="bg-green-200"
                            color="text-green-700"
                        />
                        ): (
                            <></>
                        )}
                        </div>
                )
            }
        },
        {field: "date", headerName: "Date", width: 130},
        {
            field: "action", 
            headerName: "Actions", 
            width: 200, 
            renderCell: (params) =>{
                return(
                    <div className ="flex justify-between mt-2 gap-4 w-full">
                        <ActionBtn 
                            icon={MdDeliveryDining} 
                            onClick={() =>{
                                handleDispatch(params.row.id)
                            }}
                        />
                        <ActionBtn 
                            icon={MdDone} 
                            onClick={() =>{
                                handelDeliver(params.row.id);
                            }}
                        />
                        <ActionBtn 
                            icon={MdRemoveRedEye} 
                            onClick={() =>{
                                router.push(`order/${params.row.id}`);
                            }}/>
                    </div>
                )
            }
        },
    ]

    const handleDispatch = useCallback((id: string) => {
        axios.put('/api/order',{
            id,
            deliveryStatus: 'dispatched'
        }).then((res) =>{
            toast.success('Order Dispatched')
            router.refresh()
        }).catch((err) =>{
            toast.error("Oops! Something went wrong")
            console.log(err);
            
        })
    }, []);

    const handelDeliver = useCallback((id: string) => {
        axios.put('/api/order',{
            id,
            deliveryStatus: 'delivered'
        }).then((res) =>{
            toast.success('Order Delivered')
            router.refresh()
        }).catch((err) =>{
            toast.error("Oops! Something went wrong")
            console.log(err);
            
        })
    }, []);

    return ( 
    <div className = "max-w-[1150px] m-auto text-xl">
        <div className="mb-4 mt-3">
            <Heading title ="Manage Orders" center></Heading>
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
 
export default ManageOrdersClient;