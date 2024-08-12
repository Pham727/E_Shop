'use client';

import Heading from "@/app/components/Heading";
import { Order } from "@prisma/client";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/app/utils/formatPrice";
import { MdDone, MdAccessTimeFilled, MdDeliveryDining } from "react-icons/md";
import Status from "@/app/components/Status.tsx";
import moment from "moment";
import OrderItem from "./OrderItem";

interface OrderDetailsProps{
    order: Order;
}

const OrderDetails:React.FC<OrderDetailsProps> = ({order}) => {
    return ( 
        <div className = "max-w-[1150px] m-auto flex flex-col gap-2">
            <div className="mt-5">
                <Heading title = "Order Details"/>
            </div>
            <div>Order ID: {order.id}</div>
            <div>
                Total Amount: {" "}
                <span className = "font-bold">{formatPrice(order.amount)}</span>
            </div>
            <div className = "flex gap-2 items-center">
                <div>Payment status:</div>
                <div>
                    {order.status === 'pending' ? (
                        <Status 
                        text= "pending"
                        icon= {MdAccessTimeFilled}
                        bg= "bg-slate-200"
                        color="text-slate-700"
                        />
                    ) : order.status === 'complete' ? (
                        <Status 
                        text= "complete"
                        icon= {MdDone}
                        bg= "bg-green-200"
                        color="text-green-700"
                        />
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <div className = "flex gap-2 items-center">
                <div>Delivery status:</div>
                <div>
                    {order.deliveryStatus === 'pending' ? (
                        <Status 
                        text= "pending"
                        icon= {MdAccessTimeFilled}
                        bg= "bg-slate-200"
                        color="text-slate-700"
                        />
                    ) : order.deliveryStatus === 'dispatched' ? (
                        <Status 
                        text= "dispatched"
                        icon= {MdDeliveryDining}
                        bg= "bg-purple-200"
                        color="text-purple-700"
                        />
                    ) : order.deliveryStatus === 'delivered' ? (
                        <Status 
                        text= "delivered"
                        icon= {MdDone}
                        bg= "bg-green-200"
                        color="text-green-700"
                        />
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <div>Date: {moment(order.createDate).fromNow()}</div>
            <div>
                <h2 className="font-semibold mt-2 mb-5">Products ordered</h2>
                <div className="grid grid-cols-5 text-xs gap-4 pb-2 items-center">
                    <div className="col-span-2 justify-items-start font-semibold">PRODUCT</div>
                    <div className="justify-items-center font-semibold">PRICE</div>
                    <div className="justify-items-center font-semibold">QTY</div>
                    <div className="justify-items-end font-semibold">TOTAL</div>
                </div>
                {order.products && order.products.map((item) => {
                    return <OrderItem key={item.id} item={item} />
                })}
            </div>
        </div> );
}
 
export default OrderDetails;