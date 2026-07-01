"use client";

import Link from "next/link";

import { formatPrice, getProductImage } from "@/lib/api";
import type { CartItem } from "@/types";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: number, quantity: number) => void | Promise<void>;
  onRemove: (id: number) => void | Promise<void>;
  updating?: boolean;
}

export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  updating = false,
}: CartItemRowProps) {
  const itemData = item as any;
  const product = itemData.product;
  const variant = itemData.variant;

  const itemId = Number(itemData.id);
  const quantity = Number(itemData.quantity ?? 1);

  const productHref = product?.id
    ? `/products/${product.id}`
    : product?.slug
      ? `/products/${product.slug}`
      : "#";

  const image = product
    ? getProductImage(product)
    : "/placeholder-product.svg";

  const unitPrice = Number(
    itemData.unit_price ??
      product?.effective_price ??
      product?.price ??
      0,
  );

  const lineTotal = Number(itemData.line_total ?? unitPrice * quantity);

  const decreaseQuantity = () => {
    if (quantity <= 1 || updating) {
      return;
    }

    void onUpdateQuantity(itemId, quantity - 1);
  };

  const increaseQuantity = () => {
    if (updating) {
      return;
    }

    void onUpdateQuantity(itemId, quantity + 1);
  };

  const removeItem = () => {
    if (updating) {
      return;
    }

    void onRemove(itemId);
  };

  return (
    <div className="flex gap-4 border-b border-border py-4 last:border-0">
      <Link
        href={productHref}
        className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50"
      >
        <img
          src={image}
          alt={product?.name || "Product"}
          className="h-full w-full object-contain p-2"
          onError={(event) => {
            event.currentTarget.src = "/placeholder-product.svg";
          }}
        />
      </Link>

      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href={productHref}>
            <h3 className="font-semibold text-primary hover:text-accent">
              {product?.name || "Product"}
            </h3>
          </Link>

          {variant && (
            <p className="text-sm text-muted">
              {variant.variant_name}: {variant.variant_value}
            </p>
          )}

          <p className="mt-1 font-semibold text-accent">
            {formatPrice(unitPrice)}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-xl border border-border">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={updating || quantity <= 1}
              className="h-10 w-10 rounded-l-xl text-xl font-bold text-primary disabled:opacity-50"
            >
              -
            </button>

            <span className="flex h-10 min-w-[3rem] items-center justify-center px-3 font-semibold">
              {quantity}
            </span>

            <button
              type="button"
              onClick={increaseQuantity}
              disabled={updating}
              className="h-10 w-10 rounded-r-xl text-xl font-bold text-primary disabled:opacity-50"
            >
              +
            </button>
          </div>

          <p className="min-w-[6rem] text-right font-bold text-primary">
            {formatPrice(lineTotal)}
          </p>

          <button
            type="button"
            onClick={removeItem}
            disabled={updating}
            className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-60"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
