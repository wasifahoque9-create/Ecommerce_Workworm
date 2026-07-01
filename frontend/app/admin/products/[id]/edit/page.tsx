"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { PageLoader } from "@/components/ui/Spinner";
import { adminApi } from "@/lib/api";
import type { Category } from "@/types";

type ProductImagePreview = {
  id?: number;
  image_path?: string | null;
  url?: string | null;
  is_primary?: boolean;
};

type EditProductForm = {
  category_id: string;
  name: string;
  sku: string;
  brand: string;
  price: string;
  discount_price: string;
  stock_qty: string;
  status: string;
  description: string;
};

const initialForm: EditProductForm = {
  category_id: "",
  name: "",
  sku: "",
  brand: "",
  price: "",
  discount_price: "",
  stock_qty: "",
  status: "active",
  description: "",
};

function getImageUrl(image: ProductImagePreview): string {
  const url = image.url || image.image_path || "";

  if (!url) {
    return "/placeholder-product.svg";
  }

  if (/^https?:\/\//i.test(url)) {
    return url.replace("http://", "https://");
  }

  const storageBase =
    process.env.NEXT_PUBLIC_STORAGE_URL ||
    "https://shopsphere-backend-bsma.onrender.com/storage";

  return `${storageBase}/${url.replace(/^\/+/, "").replace(/^storage\//, "")}`;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const rawId = params.id;
  const id = Number(Array.isArray(rawId) ? rawId[0] : rawId);

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<EditProductForm>(initialForm);
  const [currentImages, setCurrentImages] = useState<ProductImagePreview[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedPreviews, setSelectedPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [product, categoryResponse] = await Promise.all([
          adminApi.products.get(id),
          adminApi.categories.list(),
        ]);

        if (!mounted) return;

        const categoryList = Array.isArray(categoryResponse)
          ? categoryResponse
          : ((categoryResponse as any).data ?? []);

        setCategories(categoryList);

        setForm({
          category_id: product.category_id ? String(product.category_id) : "",
          name: product.name ?? "",
          sku: product.sku ?? "",
          brand: product.brand ?? "",
          price: product.price ? String(product.price) : "",
          discount_price: product.discount_price
            ? String(product.discount_price)
            : "",
          stock_qty:
            product.stock_qty !== null && product.stock_qty !== undefined
              ? String(product.stock_qty)
              : "0",
          status: product.status ?? "active",
          description: product.description ?? "",
        });

        setCurrentImages(product.images ?? []);
      } catch (error) {
        console.error("Unable to load product:", error);
        setError("Product could not be loaded.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [id]);

  function updateForm(field: keyof EditProductForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    selectedPreviews.forEach((url) => URL.revokeObjectURL(url));

    setSelectedFiles(files);
    setSelectedPreviews(files.map((file) => URL.createObjectURL(file)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload: Record<string, unknown> = {
        category_id: form.category_id ? Number(form.category_id) : null,
        name: form.name,
        sku: form.sku,
        brand: form.brand,
        price: Number(form.price),
        discount_price: form.discount_price
          ? Number(form.discount_price)
          : null,
        stock_qty: Number(form.stock_qty),
        status: form.status,
        description: form.description,
      };

      await adminApi.products.update(id, payload);

      router.push("/admin/products");
    } catch (error) {
      console.error("Product update failed:", error);
      setError("Product could not be updated.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/products"
          className="text-sm font-semibold text-[#121358] hover:text-orange-500"
        >
          ? Back to products
        </Link>

        <h1 className="mt-4 text-3xl font-black text-[#121358]">
          Edit Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Product category
              </label>
              <select
                value={form.category_id}
                onChange={(event) =>
                  updateForm("category_id", event.target.value)
                }
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-[#121358] focus:ring-2 focus:ring-[#121358]/20"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Product name
              </label>
              <input
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-[#121358] focus:ring-2 focus:ring-[#121358]/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                SKU
              </label>
              <input
                value={form.sku}
                onChange={(event) => updateForm("sku", event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-[#121358] focus:ring-2 focus:ring-[#121358]/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Brand
              </label>
              <input
                value={form.brand}
                onChange={(event) => updateForm("brand", event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-[#121358] focus:ring-2 focus:ring-[#121358]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(event) => updateForm("price", event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-[#121358] focus:ring-2 focus:ring-[#121358]/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Discount price
              </label>
              <input
                type="number"
                step="0.01"
                value={form.discount_price}
                onChange={(event) =>
                  updateForm("discount_price", event.target.value)
                }
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-[#121358] focus:ring-2 focus:ring-[#121358]/20"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Stock quantity
              </label>
              <input
                type="number"
                value={form.stock_qty}
                onChange={(event) =>
                  updateForm("stock_qty", event.target.value)
                }
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-[#121358] focus:ring-2 focus:ring-[#121358]/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Status
              </label>
              <select
                value={form.status}
                onChange={(event) => updateForm("status", event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-[#121358] focus:ring-2 focus:ring-[#121358]/20"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(event) =>
                updateForm("description", event.target.value)
              }
              className="min-h-36 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#121358] focus:ring-2 focus:ring-[#121358]/20"
              required
            />
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-bold text-slate-700">
              Current images
            </p>

            {currentImages.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {currentImages.map((image, index) => (
                  <div key={image.id ?? index}>
                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                      <img
                        src={getImageUrl(image)}
                        alt={form.name || "Product"}
                        className="h-full w-full object-contain p-2"
                        onError={(event) => {
                          event.currentTarget.src =
                            "/placeholder-product.svg";
                        }}
                      />
                    </div>

                    {image.is_primary && (
                      <p className="mt-2 text-xs font-bold text-green-600">
                        Primary image
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-slate-200 text-sm font-bold text-slate-500">
                Product
              </div>
            )}
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Replace product images
            </label>

            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
            />

            {selectedPreviews.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {selectedPreviews.map((preview, index) => (
                  <div key={preview}>
                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                      <img
                        src={preview}
                        alt={`Selected image ${index + 1}`}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>

                    {index === 0 && (
                      <p className="mt-2 text-xs font-bold text-green-600">
                        New primary image
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">
            <Link
              href="/admin/products"
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#121358] px-7 py-3 text-sm font-black text-white transition hover:bg-orange-500 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
