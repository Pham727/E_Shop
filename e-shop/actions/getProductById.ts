import prisma from '@/libs/prismadb'

export interface IParams{
    productId?: String;
}

export default async function getProductById(params: IParams) {
    try {
        const { productId } = params;

        const product = await prisma.product.findUnique({
            where:{
                id: productId
            },
            include:{
                reviews:{
                    include: {
                        user: true
                    },
                    orderBy:{
                        createdDate: 'desc'
                    }
                }
            }
        })
        
        if (!product) return null;

        return product;
    } catch (error : any) {
        throw new Error(error);
    }
}