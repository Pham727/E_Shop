import prisma from '@/libs/prismadb'

export interface IParams{
    orderId?: String;
}

export default async function getOrderById(params: IParams) {
    try {
        const { orderId } = params;

        const order = await prisma.order.findUnique({
            where:{
                id: orderId
            }
        })
        
        if (!order) return null;
        return order;
    } catch (error : any) {
        throw new Error(error);
    }
}