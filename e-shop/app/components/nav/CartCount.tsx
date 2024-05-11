'use client';
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { CiShoppingCart } from "react-icons/ci"

const CartCount = () => {
    const router = useRouter();
    const { cartTotalQty } = useCart();
    return (<div className="relative cursor-pointer"
        onClick={() => router.push("/cart")}>
        <div className="text-3xl">
            <CiShoppingCart />
        </div>
        <span className="
        absolute
        top-[-5px]
        right-[-5px]
      bg-slate-700
      text-white
        h-5
        w-5
        rounded-full
        flex
        items-center
        justify-center
        text-sm"
        >
            {cartTotalQty}
        </span>
    </div>);
}

export default CartCount;