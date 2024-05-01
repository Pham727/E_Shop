"use client";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import Heading from "../components/products/Heading";
import Button from "../components/Button";
import ItemContent from "./ItemContent";
import { formatPrice } from "../utils/formatPrice";

const CartClient = () => {
    const { cartProducts, cartTotalAmount, handleClearCart } = useCart();
    if (!cartProducts || cartProducts.length === 0) {
        return (
            <div className="flex flex-col items-center">
                <div className="text-2xl">Your cart is empty</div>
                <Link href={"/"} className="text-slate-500 flex items-center gap-1 mt-2">
                    <MdArrowBack />
                    <span>Starting Shooping</span>
                </Link>
            </div>);
    }
    return (
        <div>
            <Heading title="Shopping Cart" center />
            <div className="grid grid-cols-5 text-xs gap-4 mt-8 pd-2 items-center">
                <div className="col-span-2 justify-self-start">PROUCT</div>
                <div className="justify-self-center">PRICE</div>
                <div className="justify-self-center">QUANTITY</div>
                <div className="justify-self-end">TOTAL</div>
            </div>
            <div>
                {cartProducts
                    && cartProducts.map((item) => {
                        return <ItemContent item={item} />
                    })}
            </div>
            <div className="border-t-[1.5px] border-slate-500 py-4 flex justify-between gap-4">
                <div className="w-[90px]">
                    <Button lable="Clear Cart" onClick={() => handleClearCart()} small outline />
                </div>
                <div className="text-sm flex flex-col gap-1 items-start">
                    <div className="flex justify-between w-full text-base font-semibold">
                        <span>Subtotal</span>
                        <span>{formatPrice(cartTotalAmount)}</span>
                    </div>
                    <p className="text-slate-500">Taxes and shiping calculate at checkout</p>
                    <Button lable="Checkout" onClick={() => { }} />
                    <Link href={"/"} className="text-slate-500 flex items-center gap-1 mt-2">
                        <MdArrowBack />
                        <span>Continue Shooping</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default CartClient;